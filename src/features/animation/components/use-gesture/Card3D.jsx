import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import styles from "./Card3D.module.css";

export default function Card3D() {
  const [{ x, y, rotateX, rotateY, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y], down }) => {
        api.start({
          x,
          y,
          rotateX: -y / 10,
          rotateY: x / 10,
          scale: down ? 1.1 : 1,
        });
      },
      onMove: ({ xy: [px, py], dragging }) => {
        if (dragging) return;
        const x = px - window.innerWidth / 2;
        const y = py - window.innerHeight / 2;
        api.start({
          rotateX: -y / 30,
          rotateY: x / 30,
          scale: 1.05,
        });
      },
      onHover: ({ hovering }) => {
        if (!hovering) {
          api.start({ rotateX: 0, rotateY: 0, scale: 1 });
        }
      },
    },
    {
      // 🚫 阻止手机端拖动时页面滚动
      drag: { preventScroll: true, from: () => [x.get(), y.get()] },
    }
  );

  return (
    <div className={styles.container}>
      <animated.div
        {...bind()}
        className={styles.card}
        style={{
          transform: "perspective(800px)",
          x,
          y,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <div className={styles.inner}>
          <h2>React Spring + Gesture</h2>
          <p>在手机上拖我，不会滚动页面 🎉</p>
        </div>
      </animated.div>
    </div>
  );
}
