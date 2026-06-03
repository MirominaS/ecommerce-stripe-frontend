import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContex";
import { getAdminSummary } from "../../services/adminService";

import "./Dashboard.css";

const Dashboard = () => {
  const { token } = useAuth();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAdminSummary(token);

        setSummary(data.summary);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* summary card*/}

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Total Orders</h2>

          <p>{summary.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Revenue</h2>

          <p>${summary.totalRevenue}</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Products</h2>

          <p>{summary.totalProducts}</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Users</h2>

          <p>{summary.totalUsers}</p>
        </div>
      </div>

      {/* order status */}

      <div className="order-status-section">
        <h2 className="section-title">Order Status</h2>

        <div className="order-status-grid">
          <div className="status-card">
            <p>Processing</p>

            <h3>{summary.processingOrders}</h3>
          </div>

          <div className="status-card">
            <p>Shipped</p>

            <h3>{summary.shippedOrders}</h3>
          </div>

          <div className="status-card">
            <p>Delivered</p>

            <h3>{summary.deliveredOrders}</h3>
          </div>

          <div className="status-card">
            <p>Cancelled</p>

            <h3>{summary.cancelledOrders}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
