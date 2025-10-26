import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import styles from "./DraggableNote.module.css";

export default function DraggableNote() {
  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: { mass: 2, tension: 300, friction: 20 },
  }));

  const bind = useGesture(
    {
      onDrag: ({ down, offset: [dx, dy], active, cancel, movement: [mx, my] }) => {
        // 拖动前判断：是否超过 threshold
        if (!down && (Math.abs(mx) < 3 && Math.abs(my) < 3)) {
          cancel && cancel(); // 🚫 小于 3px 不触发
          return;
        }

        api.start({
          x: down ? dx : 0,
          y: down ? dy : 0,
          rotate: down ? dx / 15 : 0,
          scale: down ? 1.05 : 1,
        });
      },
      onDragEnd: ({ cancel }) => {
        // 🚀 松手立即回弹，并重置内部状态
        api.start({ x: 0, y: 0, rotate: 0, scale: 1 });
        cancel && cancel();
      },
    },
    {
      drag: {
        preventScroll: true,
        threshold: 5, // 最小触发距离
        filterTaps: true, // 🚫 点击不算拖动
        from: () => [x.get(), y.get()], // 从当前位置开始
      },
    }
  );

  return (
    <div className={styles.container}>
      <animated.div
        {...bind()}
        className={styles.note}
        style={{ x, y, rotate, scale }}
      >
        <h3 className={styles.title}>📝 我的便签</h3>
        <p className={styles.text}>
          点击不会动<br />
          拖动才会移动 💫
        </p>
      </animated.div>
    </div>
  );
}
