import React, { useState } from "react";
import styles from "./SmartMenu.module.css";

export default function SmartMenuCSS() {
  const [open, setOpen] = useState(false);
  const items = ["Profile", "Settings", "Logout"];

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        {open ? "Close Menu" : "Open Menu"}
      </button>

      <div className={`${styles.menuList} ${open ? styles.open : ""}`}>
        {items.map((item, i) => (
          <div key={i} className={styles.menuItem}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
