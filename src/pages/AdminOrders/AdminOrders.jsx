import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContex";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

import "./AdminOrders.css";

const AdminOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, token);

      fetchOrders();
    } catch (error) {
      console.log(error);

      alert("Status update failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this order?");

    if (!confirmDelete) return;

    try {
      await deleteOrder(id, token);

      alert("Order deleted");

      fetchOrders();
    } catch (error) {
      console.log(error);

      alert("Delete failed");
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
          onChange={(e) => setStatus(e.target.value)}
          className="orders-filter-select"
        >
          <option value="">All Status</option>

          <option value="processing">Processing</option>

          <option value="shipped">Shipped</option>

          <option value="delivered">Delivered</option>

          <option value="cancelled">Cancelled</option>
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
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`status-select ${order.orderStatus}`}
                  >
                    <option value="processing">Processing</option>

                    <option value="shipped">Shipped</option>

                    <option value="delivered">Delivered</option>

                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="delete-order-btn"
                  >
                    Delete
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
          Prev
        </button>

        <span className="pagination-text">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
