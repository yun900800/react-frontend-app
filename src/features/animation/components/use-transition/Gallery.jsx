import React, { useState, useCallback } from "react";
import { useTransition, animated } from "@react-spring/web";
import styles from "./Gallery.module.css";

const IMAGES = [
  { id: 0, url: "https://placehold.co/600x350/FF5733/white?text=Red+Theme" },
  { id: 1, url: "https://placehold.co/600x350/33FF57/white?text=Green+Theme" },
  { id: 2, url: "https://placehold.co/600x350/3357FF/white?text=Blue+Theme" },
  { id: 3, url: "https://placehold.co/600x350/FF33A1/white?text=Pink+Theme" },
];

export default function Gallery() {
  const [index, setIndex] = useState(0);

  const nextImage = useCallback(() => {
    setIndex((state) => (state + 1) % IMAGES.length);
  }, []);

  const prevImage = useCallback(() => {
    setIndex((state) => (state - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  // 图片切换动画
  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0, scale: 1.05 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.95 },
    config: { mass: 1, tension: 150, friction: 20 },
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>可切换相册画廊 (useTransition)</h1>

      <div className={styles.gallery}>
        {transitions((style, i) => (
          <animated.img
            key={i}
            style={style}
            className={styles.image}
            src={IMAGES[i].url}
            alt={`Gallery Image ${i + 1}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x350/ccc/white?text=Error";
            }}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={prevImage} className={styles.button}>
          上一张
        </button>
        <button onClick={nextImage} className={styles.button}>
          下一张
        </button>
      </div>
    </div>
  );
}
