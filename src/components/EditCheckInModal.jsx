import React from "react";
import styles from "../pages/EditCheckInModal.module.css"; // Assuming you have a CSS module for styles
import stylesDs from "../pages/Dashboard.module.css"; // Assuming you have a CSS module for styles
const EditCheckInModal = ({
  isOpen,
  onClose,
  checkIn,
  role,
  onSave,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Check-In</h2>
        <label>
          Purpose:
          <input
            type="text"
            name="purpose"
            value={checkIn.purpose}
            onChange={onChange}
          />
        </label>
        <label>
          Delivery ID:
          <input
            type="text"
            name="deliveryId"
            value={checkIn.deliveryId}
            onChange={onChange}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={checkIn.location}
            onChange={onChange}
          />
        </label>
        {role === "admin" && (
          <label>
            Status:
            <select
              name="status"
              value={checkIn.status}
              onChange={onChange}
              className={stylesDs.statusSelect}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        )}
        <label>
          Note:
          <textarea
            name="note"
            value={checkIn.note}
            onChange={onChange}
          ></textarea>
        </label>

        <div className={styles.buttons}>
          <button onClick={onSave}>Save</button>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCheckInModal;
