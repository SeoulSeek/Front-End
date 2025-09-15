import React from 'react';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <h3 className={styles.title}>로그아웃하시겠습니까?</h3>
          <div className={styles.buttonContainer}>
            <button 
              className={styles.cancelButton} 
              onClick={onCancel}
            >
              취소
            </button>
            <button 
              className={styles.confirmButton} 
              onClick={onConfirm}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
