import React, { useState, useEffect } from "react";
import { getMyOrders } from "../../services/orderService";
import "./Order.css";
const Order = () => {
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
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 ? (
        <h2 className="no-orders">No orders found</h2>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <h2 className="order-id">Order ID: {order._id}</h2>

                <span className="order-status">{order.orderStatus}</span>
              </div>

              <p className="order-total">Total: ${order.totalPrice}</p>

              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div className="order-item" key={item._id}>
                    <p className="item-title">{item.title}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                    <p className="item-price">Price: ${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
