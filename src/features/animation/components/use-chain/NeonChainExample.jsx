// NeonChainExample.jsx
import React, { useState } from "react";
import {
  useSpring,
  useTrail,
  animated,
  useChain,
  useSpringRef,
  to
} from "@react-spring/web";
import styles from "./NeonChainExample.module.css";

const NeonChainExample = () => {
  const [open, setOpen] = useState(false);

  // 使用 react-spring 提供的 spring ref（而不是 React.useRef）
  const circleRef = useSpringRef();
  const trailRef = useSpringRef();

  // 光环动画（使用 circleRef）
  const circleSpring = useSpring({
    ref: circleRef,
    from: { scale: 0, opacity: 0 },
    to: { scale: open ? 1 : 0, opacity: open ? 1 : 0 },
    config: { mass: 2, tension: 180, friction: 16 },
  });

  // 卡片组动画（useTrail + trailRef）
  const trail = useTrail(4, {
    ref: trailRef,
    from: { opacity: 0, x: 40, rotateY: 90 },
    to: {
      opacity: open ? 1 : 0,
      x: open ? 0 : 40,
      rotateY: open ? 0 : 90,
    },
    config: { mass: 1, tension: 200, friction: 15 },
  });

  // 串联：打开时 circle -> trail；关闭时 trail -> circle
  useChain(open ? [circleRef, trailRef] : [trailRef, circleRef], [0, 0.3]);

  return (
    <div className={styles.container}>
      {/* 霓虹光环 */}
      <animated.div
        style={{
          transform: circleSpring.scale.to((s) => `scale(${s})`),
          opacity: circleSpring.opacity,
        }}
        className={styles.circle}
      >
        <div className={styles.circleGlow}></div>
      </animated.div>

      {/* 卡片组 */}
      <div className={styles.cardGroup}>
        {trail.map((spr, i) => (
          <animated.div
            key={i}
            // 合并两个 animated 值为一个 transform 字符串
            style={{
              transform: to(
                [spr.x, spr.rotateY],
                (x, r) => `translateY(${x}px) rotateY(${r}deg)`
              ),
              opacity: spr.opacity,
            }}
            className={styles.card}
          >
            {["A", "B", "C", "D"][i]}
          </animated.div>
        ))}
      </div>

      <button
        onClick={() => setOpen((p) => !p)}
        className={styles.button}
      >
        {open ? "Reset" : "Activate"}
      </button>
    </div>
  );
};

export default NeonChainExample;
