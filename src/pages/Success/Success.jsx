import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Success.css";
import { paymentSuccess } from "../../services/paymentService";

const Success = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const completePayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const token = localStorage.getItem("token");
        const data = await paymentSuccess(sessionId, token);
        localStorage.removeItem("cart");

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    completePayment();
  }, []);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <h1 className="success-title">Payment Successful</h1>

        <p className="success-text">Your order has been placed successfully.</p>

        <button className="success-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Success;
