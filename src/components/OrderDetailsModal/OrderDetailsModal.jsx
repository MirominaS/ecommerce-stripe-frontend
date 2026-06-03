import React from 'react'
import './OrderDetailsModal.css'

const OrderDetailsModal = ({order,onClose}) => {
  return (
     <div className="order-modal-overlay">
      <div className="order-modal">
        <div className="receipt">

          <h2>ORDER DETAILS</h2>

          <div className="receipt-info">
            <p>
              <strong>Customer:</strong>{" "}
              {order.user?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.user?.email}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.orderStatus}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {order.payment?.paymentStatus}
            </p>
          </div>

          <hr />

          <h3>Items</h3>

          <div className="receipt-items">
            {order.orderItems?.map((item) => (
              <div
                key={item.product}
                className="receipt-item"
              >
                <span>{item.title}</span>

                <span>x{item.quantity}</span>

                <span>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr />

          <div className="receipt-total">
            <strong>Total:</strong>

            <strong>
              ${order.totalPrice.toFixed(2)}
            </strong>
          </div>

          <button
            className="close-modal-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal