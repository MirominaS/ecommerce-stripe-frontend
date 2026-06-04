import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContex";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";
import { FaEye } from "react-icons/fa";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaAngleDoubleLeft } from "react-icons/fa";

import "./AdminOrders.css";

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

    const confirmed = window.confirm(
      `Change order status from "${currentStatus}" to "${newStatus}"?\n\nThis action cannot be reversed.`,
    );

    if (!confirmed) {
      fetchOrders();
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus, token);

      fetchOrders();
    } catch (error) {
      console.log(error);

      alert("Status update failed");
    }
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
          onChange={(e) =>
            handleStatusChange(order._id, order.orderStatus, e.target.value)
          }
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
    </div>
  );
};

export default AdminOrders;
