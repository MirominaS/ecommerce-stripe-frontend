import React from "react";
import "./AlertModal.css";

const AlertModal = ({
  isOpen,
  title,
  message,
  type = "success",
  showCancel = false,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className={`modal-title ${type}`}>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          {showCancel && (
            <button className="modal-cancel-btn" onClick={onClose}>
              {cancelText}
            </button>
          )}

          <button className="modal-btn" onClick={onConfirm || onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
