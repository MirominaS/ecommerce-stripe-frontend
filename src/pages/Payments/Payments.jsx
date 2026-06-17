import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContex";
import { getAllPayments } from "../../services/paymentService";
import "./Payments.css";

const Payments = () => {
  const { token } = useAuth();

  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [page, status, search]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const data = await getAllPayments(token, page, 10, status, search);

      setPayments(data.payments);

      setPagination(data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Payments</h1>
          <p>Monitor customer payment transactions</p>
        </div>
      </div>

      <div className="payments-filters">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="payments-search"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="payments-filter-select"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="payments-table-wrapper">
        <table className="payments-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="payment-user">{payment.user?.name}</td>

                <td className="payment-email">{payment.user?.email}</td>

                <td className="payment-amount">€{payment.amount}</td>

                <td>
                  <span className={`payment-status ${payment.paymentStatus}`}>
                    {payment.paymentStatus}
                  </span>
                </td>

                <td className="payment-date">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pagination-btn"
        >
          Previous
        </button>

        <span className="pagination-text">
          Page {pagination?.page} of {pagination?.totalPages}
        </span>

        <button
          disabled={page === pagination?.totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Payments;
