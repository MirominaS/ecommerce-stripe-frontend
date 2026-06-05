import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContex";
import {
  deleteOrder,
  exportOrders,
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";
import { FaEye } from "react-icons/fa";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { BiExport } from "react-icons/bi";
import AlertModal from "../../components/AlertModal/AlertModal";
import "./AdminOrders.css";
import { showError, showSuccess } from "../../utils/toast";

const AdminOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    showCancel: false,
    onConfirm: null,
  });

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(token, {
        page,
        limit: 10,
        status,
        search,
      });

      setOrders(data.orders);

      setPagination(data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, search]);

  // UPDATE STATUS

  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) {
      return;
    }

    setAlertModal({
      isOpen: true,
      title: "Update Order Status",
      message: `Change order status from "${currentStatus}" to "${newStatus}"?\n\nThis action cannot be reversed.`,
      type: "warning",
      showCancel: true,

      onConfirm: async () => {
        setAlertModal((prev) => ({
          ...prev,
          isOpen: false,
        }));

        try {
          await updateOrderStatus(orderId, newStatus, token);

          fetchOrders();

          showSuccess("Order status updated successfully");
        } catch (error) {
          console.log(error);

          showError("Status update failed");
        }
      },
    });
  };

  const statusOptions = {
    processing: ["processing", "shipped", "cancelled"],
    shipped: ["shipped", "delivered"],
    delivered: ["delivered", "refunded"],
    cancelled: ["cancelled"],
    refunded: ["refunded"],
  };

  const handleViewOrder = (order) => {
    console.log(order);
    setSelectedOrder(order);
    setShowOrders(true);
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setShowOrders(false);
  };

  // HANDLE EXPORT ORDERS
  const handleExport = async () => {
    if (!exportFrom || !exportTo) {
      showError("Please select date and range");
      return;
    }
    try {
      setIsExporting(true);
      const blob = await exportOrders(token, {
        from: exportFrom,
        to: exportTo,
        status: exportStatus,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-${exportFrom}-${exportTo}.csv`;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowExportModal(false);
      setExportFrom("");
      setExportTo("");
      setExportStatus("");
      showSuccess("Export completed");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading...</div>;
  }

  return (
    <div className="admin-orders">
      {/* HEADER */}

      <div className="orders-header">
        <div>
          <h1>Orders</h1>

          <p>Manage and track customer orders</p>
        </div>
        <div className="orders-header-actions">
          <button
            className="export-btn"
            onClick={() => {
              console.log("Clicked");
              setShowExportModal(true);
            }}
          >
            <BiExport />
            Export Orders
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <div className="orders-filters">
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="orders-search"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="orders-filter-select"
        >
          <option value="">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* TABLE */}

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="customer-name">{order.user?.name}</td>
                <td className="customer-email">{order.user?.email}</td>
                <td className="order-total">${order.totalPrice}</td>

                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        order.orderStatus,
                        e.target.value,
                      )
                    }
                    className={`status-select ${order.orderStatus}`}
                  >
                    {statusOptions[order.orderStatus]?.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <button
                    className="view-order-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pagination-btn"
        >
          <FaAngleDoubleLeft />
        </button>

        <span className="pagination-text">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
      {showOrders && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeOrder} />
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        showCancel={alertModal.showCancel}
        onConfirm={alertModal.onConfirm}
        onClose={() =>
          setAlertModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
      {/* export modal */}
      {showExportModal && (
        <>
          {console.log("MODAL RENDERING")}
          <div className="export-modal-overlay">
            <div className="export-modal">
              <h2>Export Orders</h2>

              <label>From</label>
              <input
                type="date"
                value={exportFrom}
                onChange={(e) => setExportFrom(e.target.value)}
              />

              <label>To</label>
              <input
                type="date"
                value={exportTo}
                onChange={(e) => setExportTo(e.target.value)}
              />

              <label>Status</label>
              <select
                value={exportStatus}
                onChange={(e) => setExportStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>

              <div className="export-actions">
                <button className="export-btn" onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>

                <button className="export-btn" disabled={isExporting} onClick={handleExport}>
                  {isExporting ? "Exporting..." : "Export"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
