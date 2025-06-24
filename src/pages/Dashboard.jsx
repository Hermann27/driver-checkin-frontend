import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import ThemeToggleButton from "../components/ThemeToggleButton";
const Dashboard = () => {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [driver, setDriver] = useState(null);
  const [showCheckIns, setShowCheckIns] = useState(true);

  useEffect(() => {
    const storedDriver = localStorage.getItem("driver");
    if (!storedDriver) {
      navigate("/login");
      return;
    }
    setDriver(JSON.parse(storedDriver));
  }, [navigate]);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/v1/checkins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCheckIns(res.data.checkIns);
      } catch (err) {
        console.error("Failed to load check-ins", err);
      }
    };
    fetchCheckIns();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("driver");
    navigate("/login");
  };

  const handleEdit = (id) => {
    console.log("Edit", id);
    // Navigate or open edit modal
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Driver Portal</div>
        <div className={styles.navLinks}>
          {!driver ? (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/register")}>Sign Up</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/dashboard/checkin")}>
                Check-In
              </button>
              <button onClick={() => setShowCheckIns(true)}>
                View Check-Ins
              </button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
      {showCheckIns && (
        <div className={styles.dashboardContent}>
          <h1>Welcome, {driver?.name || "Driver"}!</h1>
          <div className={styles.grid}>
            {checkIns.length === 0 ? (
              <p>No check-ins found.</p>
            ) : (
              checkIns.map((checkIn) => (
                <div key={checkIn._id} className={styles.card}>
                  <h3>{checkIn.purpose}</h3>
                  <p>{checkIn.location}</p>
                  <small>{new Date(checkIn.createdAt).toLocaleString()}</small>
                  <button onClick={() => handleEdit(checkIn._id)}>Edit</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
