import React, { useState, useEffect } from "react";
import styles from "./SmartMenu.module.css";

export default function SmartMenuKeyframes() {
  const [open, setOpen] = useState(false);
  const [activeItems, setActiveItems] = useState([]);
  const items = ["Dashboard", "Projects", "Analytics"];

  useEffect(() => {
    if (open) {
      // 逐项进入动画
      items.forEach((_, i) => {
        setTimeout(() => {
          setActiveItems((prev) => [...prev, i]);
        }, i * 100);
      });
    } else {
      setActiveItems([]);
    }
  }, [open]);

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        {open ? "Hide Menu" : "Show Menu"}
      </button>

      <div className={styles.menuList}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`${styles.menuItem} ${
              activeItems.includes(i) ? styles.animateIn : ""
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
