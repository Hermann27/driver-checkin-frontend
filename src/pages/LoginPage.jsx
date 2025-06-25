import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        form
      );
      if (response.status !== 200) {
        throw new Error("Login failed. Please try again.");
      }
      const { token, driver } = response.data;

      // Save token and optionally driver info to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("driver", JSON.stringify(driver));

      console.log("Login successful:", driver);

      if (onLogin) {
        onLogin(driver);
      }
      console.log("Login successful:", onLogin);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login Page </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className={styles.registerPrompt}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.registerLink}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
