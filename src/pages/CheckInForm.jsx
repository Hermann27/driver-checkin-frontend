import React, { useState } from "react";
import axios from "axios";
import styles from "./CheckInForm.module.css";

const CheckInForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    purpose: "",
    deliveryId: "",
    location: "",
    note: "",
    proofImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proofImage") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/checkins",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Check-in submitted successfully");
      if (onSuccess) onSuccess(); // Auto-refresh and switch
    } catch (error) {
      alert(error.response?.data?.msg || "Check-in failed");
    }
  };

  return (
    <div>
      <h2>New Check-In</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className={styles.form}
      >
        <label>
          Purpose:
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            className={styles.input}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Delivery ID:
          <input
            type="text"
            name="deliveryId"
            className={styles.input}
            value={formData.deliveryId}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            className={styles.input}
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Note:
          <textarea
            name="note"
            value={formData.note}
            className={styles.textarea}
            placeholder="Enter any additional notes"
            onChange={handleChange}
          ></textarea>
        </label>
        <br />
        <label>
          Upload Proof Image:
          <input
            type="file"
            className={styles.fileInput}
            name="proofImage"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit" className={styles.button}>
          Check-In
        </button>
      </form>
    </div>
  );
};

export default CheckInForm;
