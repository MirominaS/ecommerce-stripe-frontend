import React from "react";
import "./UserDetailsModal.css";
import { IoMdClose } from "react-icons/io";

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <div className="user-modal-header">
          <h2>User Details</h2>

          <button className="close-btn" onClick={onClose}>
            <IoMdClose />
          </button>
        </div>

        <div className="user-details">
          <div className="detail-row">
            <strong>ID:</strong>
            <span>{user._id}</span>
          </div>

          <div className="detail-row">
            <strong>Name:</strong>
            <span>{user.name}</span>
          </div>

          <div className="detail-row">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>

          <div className="detail-row">
            <strong>Role:</strong>
            <span>{user.role}</span>
          </div>

          <div className="detail-row">
            <strong>Status:</strong>
            <span>{user.isActive ? "Active" : "Inactive"}</span>
          </div>

          <div className="detail-row">
            <strong>Created:</strong>
            <span>{new Date(user.createdAt).toLocaleString()}</span>
          </div>

          <div className="detail-row">
            <strong>Updated:</strong>
            <span>{new Date(user.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
