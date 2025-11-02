import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SmartMenu.module.css";

export default function SmartMenuMotion() {
  const [open, setOpen] = useState(false);
  const items = ["Home", "Explore", "Contact"];

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        {open ? "Collapse Menu" : "Expand Menu"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.menuList}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item, i) => (
              <motion.div
                key={item}
                className={styles.menuItem}
                variants={variants}
                custom={i}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
