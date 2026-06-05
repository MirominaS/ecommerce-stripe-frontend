import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useAuth } from "../../context/AuthContex";
import { getAdminAnalytics } from "../../services/adminService";
import AlertModal from "../../components/AlertModal/AlertModal";

import "./Analytics.css";
import { showWarning } from "../../utils/toast";

const Analytics = () => {
  const { token } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomFilter, setShowCustomFilter] = useState(false);

  const STATUS_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const PAYMENT_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  const fetchAnalytics = async (
    filter = "today",
    fromDate = "",
    toDate = "",
  ) => {
    try {
      setLoading(true);

      const data = await getAdminAnalytics(token, filter, fromDate, toDate);

      setAnalytics(data.analytics);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics("today");
    }
  }, [token]);

  const ProductRevenueTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const product = payload[0].payload;

      return (
        <div className="custom-tooltip">
          <p>
            <strong>{product.title}</strong>
          </p>

          <p>Revenue: ${product.revenue.toLocaleString()}</p>

          <p>Units Sold: {product.totalSold}</p>
        </div>
      );
    }

    return null;
  };

  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      showWarning("Please select both From Date and To Date")

      return;
    }

    fetchAnalytics("custom", fromDate, toDate);

    setShowCustomFilter(false);
  };

  if (loading) {
    return <div className="analytics-loading">Loading...</div>;
  }

  if (!analytics) {
    return <div className="analytics-empty">No analytics found</div>;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Monitor revenue, orders and performance</p>
        </div>

        <select
          className="analytics-period-select"
          value={filterType}
          onChange={(e) => {
            const value = e.target.value;
            setFilterType(value);

            if (value === "custom") {
              setShowCustomFilter(true);
            } else {
              setShowCustomFilter(false);
              fetchAnalytics(value);
            }
          }}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="lastyear">Last Year</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {showCustomFilter && (
        <div
          className="custom-filter-overlay"
          onClick={() => setShowCustomFilter(false)}
        >
          <div
            className="custom-filter-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Custom Date Range</h3>

            <div className="custom-filter-inputs">
              <div className="custom-input-group">
                <label>From Date</label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="custom-input-group">
                <label>To Date</label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="custom-filter-actions">
              <button className="apply-filter-btn" onClick={handleApplyFilter}>
                Apply Filter
              </button>

              <button
                className="cancel-filter-btn"
                onClick={() => {
                  setShowCustomFilter(false);
                  setFilterType("today");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS */}

      <div className="analytics-stats">
        <div className="stat-card">
          <h3>Revenue Records</h3>

          <p>{analytics.dailyAnalytics?.length}</p>
        </div>

        <div className="stat-card">
          <h3>Monthly Orders</h3>

          <p>{analytics.monthlyAnalytics?.length}</p>
        </div>

        <div className="stat-card">
          <h3>Status Types</h3>

          <p>{analytics.orderStatusAnalytics?.length}</p>
        </div>

        <div className="stat-card">
          <h3>Top Products</h3>

          <p>{analytics.topSellingProducts?.length}</p>
        </div>
      </div>

      {/* CHART GRID */}

      <div className="analytics-grid">
        {/* REVENUE */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Revenue Analytics</h2>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.dailyAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="_id" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ORDERS */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Orders Analytics</h2>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.monthlyAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="_id" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="orders" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ORDER STATUS */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Order Status</h2>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.orderStatusAnalytics}
                dataKey="value"
                nameKey="_id"
                outerRadius={90}
                label
              >
                {analytics.orderStatusAnalytics.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* PAYMENT STATUS */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Payment Status</h2>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.paymentStatusAnalytics}
                dataKey="count"
                nameKey="_id"
                outerRadius={90}
                label
              >
                {analytics.paymentStatusAnalytics.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY */}

        <div className="analytics-card full-width">
          <div className="analytics-card-header">
            <h2>Revenue By Category</h2>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.revenueByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis type="category" dataKey="_id" width={120} />

              <Tooltip />

              <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PRODUCTS */}

        <div className="analytics-card full-width">
          <div className="analytics-card-header">
            <h2>Top Products By Revenue</h2>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.topSellingProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis type="category" dataKey="title" width={180} />

              <Tooltip content={<ProductRevenueTooltip />} />

              <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
