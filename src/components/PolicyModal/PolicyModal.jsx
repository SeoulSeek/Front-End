import React from "react";
import styles from "./PolicyModal.module.css";

const PolicyModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          <p className={styles.modalText}>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
