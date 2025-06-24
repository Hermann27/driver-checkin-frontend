import React, { useEffect, useState } from "react";
import styles from "../pages/Dashboard.module.css";

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else if (theme === "light") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "auto";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  return (
    <button className={styles.toggleButton} onClick={toggleTheme}>
      {theme === "dark" ? "System" : theme === "light" ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeToggleButton;
