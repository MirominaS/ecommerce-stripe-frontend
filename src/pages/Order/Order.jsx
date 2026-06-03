import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import "./Order.css";
import Navbar from "../../components/Navbar/Navbar";

const Order = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const data = await getMyOrders(token);

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <div className="orders-header">
          <h1>My Orders ({orders.length})</h1>

          <p>Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No Orders Yet</h2>

            <p>Start shopping to see your orders here.</p>

            <button onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                {/* HEADER */}

                <div className="order-header">
                  <div>
                    <h2 className="order-id">Order #{order._id}</h2>

                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`order-status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* SUMMARY */}

                <div className="order-summary-row">
                  <span>{order.orderItems.length} Items</span>

                  <span>Total: ${order.totalPrice}</span>
                </div>

                {/* ITEMS */}

                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div className="order-item" key={index}>
                      <div className="order-item-info">
                        <h4>{item.title}</h4>

                        <p>Quantity: {item.quantity}</p>
                      </div>

                      <div className="order-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
