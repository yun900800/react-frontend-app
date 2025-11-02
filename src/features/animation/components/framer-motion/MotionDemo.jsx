import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './MotionDemo.module.css';

// --- 子元素动画变体 ---
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// --- 父容器动画变体 ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

// 数据
const data = [
  { id: 1, text: '声明式动画 (Declarative)' },
  { id: 2, text: '父子元素协调 (Stagger)' },
  { id: 3, text: '状态驱动 (State Driven)' },
  { id: 4, text: '布局魔法 (Layout Magic)' },
  { id: 5, text: '高性能 CSS 变换 (High Performance)' },
];

const MotionDemo = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Framer Motion 声明式变体演示
      </h1>

      <motion.ul
        className={styles.list}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className={styles.subheading}>Framer Motion 核心特性</h2>

        {data.map((item) => (
          <motion.li
            key={item.id}
            className={styles.listItem}
            variants={itemVariants}
          >
            {item.text}
          </motion.li>
        ))}
      </motion.ul>

      <p className={styles.note}>
        注意：我们只声明了终点状态（<code>visible</code>）和
        <code>staggerChildren: 0.1</code> 的规则，
        但没有手动编写延迟代码。这就是声明式时间线的力量。
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
};

export function ClickToAnimate() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => setIsVisible((v) => !v)}>
        {isVisible ? "隐藏" : "显示"}
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          background: "skyblue",
          marginTop: 20,
          borderRadius: 12,
        }}
        variants={itemVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      />
    </div>
  );
}

export default MotionDemo;



