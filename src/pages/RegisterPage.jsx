import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    licensePlate: "",
    company: "",
    phoneNumber: "",
  });
  const [driverLicensePhoto, setDriverLicensePhoto] = useState(null);
  const [driverPicture, setDriverPicture] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "driverLicensePhoto") {
        setDriverLicensePhoto(files[0]);
      } else if (name === "driverPicture") {
        setDriverPicture(files[0]);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.licensePlate.trim())
      newErrors.licensePlate = "License plate is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!driverLicensePhoto)
      newErrors.driverLicensePhoto = "License photo is required";
    if (!driverPicture) newErrors.driverPicture = "Driver picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      data.append("driverLicensePhoto", driverLicensePhoto);
      data.append("driverPicture", driverPicture);

      await axios.post("http://localhost:5000/api/v1/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Registration successful!");
      setErrors({});
      setFormData({
        name: "",
        email: "",
        password: "",
        licensePlate: "",
        company: "",
        phoneNumber: "",
      });
      setDriverLicensePhoto(null);
      setDriverPicture(null);
    } catch (err) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Driver Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <input
            className={styles.input}
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="licensePlate">
            License Plate
          </label>
          <input
            className={styles.input}
            id="licensePlate"
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
          />
          {errors.licensePlate && (
            <p className={styles.errorMessage}>{errors.licensePlate}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="company">
            Company
          </label>
          <input
            className={styles.input}
            id="company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          {errors.company && (
            <p className={styles.errorMessage}>{errors.company}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            className={styles.input}
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <p className={styles.errorMessage}>{errors.phoneNumber}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="driverLicensePhoto">
            Driver License Photo
          </label>
          <input
            className={styles.inputFile}
            id="driverLicensePhoto"
            type="file"
            name="driverLicensePhoto"
            onChange={handleFileChange}
          />
          {errors.driverLicensePhoto && (
            <p className={styles.errorMessage}>{errors.driverLicensePhoto}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="driverPicture">
            Driver Picture
          </label>
          <input
            className={styles.inputFile}
            id="driverPicture"
            type="file"
            name="driverPicture"
            onChange={handleFileChange}
          />
          {errors.driverPicture && (
            <p className={styles.errorMessage}>{errors.driverPicture}</p>
          )}
        </div>

        <button className={styles.button} type="submit">
          Register
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: message.includes("failed") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
