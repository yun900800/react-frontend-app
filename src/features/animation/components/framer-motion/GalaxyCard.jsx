import { motion } from "framer-motion";
import styles from "./GalaxyCard.module.css";

const bgVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.2,
    rotate: 30,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};


const contentVariants = {
  rest: { y: 20, opacity: 0, rotateX: -15 },
  hover: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

const lightVariants = {
  rest: { opacity: 0, x: "-100%" },
  hover: {
    opacity: 0.4,
    x: "110%",
    transition: {
      duration: 1.2,
      ease: "easeInOut",
    },
  },
};

export function GalaxyCard() {
  return (
    <motion.div
      className={styles.card}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.div className={styles.bg} variants={bgVariants} />
      <motion.div className={styles.light} variants={lightVariants} />
      <motion.div className={styles.content} variants={contentVariants}>
        <h2 className={styles.title}>Cosmic Journey</h2>
        <p className={styles.desc}>
          Explore the stars with smooth transitions and subtle depth motion.
        </p>
      </motion.div>
    </motion.div>
  );
}
