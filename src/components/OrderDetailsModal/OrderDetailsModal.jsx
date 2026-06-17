import React from "react";
import "./OrderDetailsModal.css";

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="order-modal-overlay">
      <div className="order-modal">
        <div className="receipt">
          <h2>ORDER DETAILS</h2>

          <div className="receipt-info">
            <p>
              <strong>Customer:</strong> {order.user?.name}
            </p>

            <p>
              <strong>Email:</strong> {order.user?.email}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong> {order.orderStatus}
            </p>

            <p>
              <strong>Payment:</strong> {order.payment?.paymentStatus}
            </p>
          </div>

          <hr />

          <h3>Items</h3>

          <div className="receipt-items">
            {order.orderItems?.map((item, index) => (
              <div key={`${item.product}-${index}`} className="receipt-item">
                <div>
                  <span>{item.title}</span>

                  {item.variantAttributes &&
                    Object.keys(item.variantAttributes).length > 0 && (
                      <div className="variant-details">
                        {Object.entries(item.variantAttributes).map(
                          ([key, value]) => (
                            <div key={key}>
                              <small>
                                {key}: {value}
                              </small>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>

                <span>x{item.quantity}</span>

                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr />

          <div className="receipt-total">
            <strong>Total:</strong>

            <strong>€{order.totalPrice.toFixed(2)}</strong>
          </div>

          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
