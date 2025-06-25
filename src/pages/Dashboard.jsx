import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import EditCheckInModal from "../components/EditCheckInModal";
import CheckInForm from "./CheckInForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [driver, setDriver] = useState(null);
  const [showCheckIns, setShowCheckIns] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("checkins");
  useEffect(() => {
    const storedDriver = localStorage.getItem("driver");
    if (!storedDriver) {
      navigate("/login");
      return;
    }
    setDriver(JSON.parse(storedDriver));
  }, [navigate]);

  const fetchCheckIns = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedDriver = JSON.parse(localStorage.getItem("driver"));

      console.log("storedDriver:", storedDriver);
      const url =
        storedDriver.role === "admin"
          ? "http://localhost:5000/api/v1/checkins/all"
          : "http://localhost:5000/api/v1/checkins";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckIns(res.data.checkIns);
    } catch (err) {
      console.error("Failed to load check-ins", err);
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      if (driver?.role === "admin") {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            "http://localhost:5000/api/v1/auth/drivers",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsers(res.data.drivers);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      }
    };
    fetchUsers();
  }, [driver]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("driver");
    navigate("/login");
  };

  const handleEdit = (id) => {
    const toEdit = checkIns.find((c) => c._id === id);
    setEditingCheckIn({ ...toEdit }); // clone to avoid direct state mutation
    setIsModalOpen(true);
  };
  const handleModalChange = (e) => {
    setEditingCheckIn((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedDriver = JSON.parse(localStorage.getItem("driver"));
      const url =
        storedDriver.role === "admin"
          ? `http://localhost:5000/api/v1/checkins/${editingCheckIn._id}/status`
          : `http://localhost:5000/api/v1/checkins/${editingCheckIn._id}`;

      await axios.patch(url, editingCheckIn, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = checkIns.map((item) =>
        item._id === editingCheckIn._id ? editingCheckIn : item
      );
      setCheckIns(updated);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update check-in", err);
    }
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
              {driver?.role === "admin" && (
                <button onClick={() => setView("users")}>Manage Users</button>
              )}
              <button onClick={() => setView("form")}>Check-In</button>
              <button onClick={() => setView("checkins")}>
                View Check-Ins
              </button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
      {/* {showCheckIns ? (
        <div className={styles.dashboardContent}>
          <h1>
            Welcome, {driver?.name || "Driver"}! &nbsp; You are logged in as{" "}
            {driver?.role || "Driver"}.
          </h1>{" "}
          <center>
            <h1>Your Check-Ins:</h1>
          </center>
          <div className={styles.grid}>
            {checkIns.length === 0 ? (
              <p>No check-ins found.</p>
            ) : (
              checkIns.map((checkIn) => (
                <div key={checkIn._id} className={styles.card}>
                  <h3>Purpose: {checkIn.purpose}</h3>
                  <p>Location: {checkIn.location}</p>
                  <p>Status: {checkIn.status}</p>
                  <small>{new Date(checkIn.createdAt).toLocaleString()}</small>
                  <button onClick={() => handleEdit(checkIn._id)}>Edit</button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <CheckInForm
              onSuccess={() => {
                fetchCheckIns(); // refresh check-ins
                setShowCheckIns(true); // return to list
              }}
            />
          </div>
        </div>
      )}*/}

      {view === "checkins" && (
        <div className={styles.dashboardContent}>
          <h1>
            Welcome, {driver?.name || "Driver"}! &nbsp; You are logged in as{" "}
            {driver?.role || "Driver"}.
          </h1>
          <center>
            <h1>Your Check-Ins:</h1>
          </center>
          <div className={styles.grid}>
            {checkIns.length === 0 ? (
              <p>No check-ins found.</p>
            ) : (
              checkIns.map((checkIn) => (
                <div key={checkIn._id} className={styles.card}>
                  <h3>Purpose: {checkIn.purpose}</h3>
                  <p>Location: {checkIn.location}</p>
                  <p>Status: {checkIn.status}</p>
                  <small>{new Date(checkIn.createdAt).toLocaleString()}</small>
                  <button onClick={() => handleEdit(checkIn._id)}>Edit</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {view === "form" && (
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <CheckInForm
              onSuccess={() => {
                fetchCheckIns();
                setView("checkins");
              }}
            />
          </div>
        </div>
      )}

      {view === "users" && driver?.role === "admin" && (
        <div className={styles.dashboardContent}>
          <h2>User List</h2>
          <div className={styles.grid}>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className={styles.card}>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>Phone: {user.phoneNumber}</p>
                  <small>Role: {user.role}</small>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <EditCheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        checkIn={editingCheckIn}
        role={driver?.role}
        onSave={handleSave}
        onChange={handleModalChange}
      />
    </div>
  );
};

export default Dashboard;
