import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import "./Order.css";
import Navbar from "../../components/Navbar/Navbar";
import { FaEye } from "react-icons/fa";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";
import Footer from "../../components/Footer/Footer";

const Order = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

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

                  <button
                    className="view-order-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye />
                  </button>
                </div>

                {/* SUMMARY */}

                <div className="order-summary-row">
                  <span>{order.orderItems.length} Items</span>

                  <span>Total: €{order.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
        )}
      </div>
      <Footer/>
    </>
  );
};

export default Order;
