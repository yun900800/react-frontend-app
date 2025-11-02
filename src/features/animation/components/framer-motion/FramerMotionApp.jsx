import React, { useState } from 'react';
import { motion, LayoutGroup  } from 'framer-motion';
import styles from './FramerMotionApp.module.css';

// --- Card Data ---
const initialItems = [
  { id: 1, title: '山脉 (Mountains)', color: 'indigo', content: '探索壮丽的山脉景色' },
  { id: 2, title: '海洋 (Ocean)', color: 'sky', content: '深入湛蓝的海洋世界' },
  { id: 3, title: '森林 (Forest)', color: 'green', content: '感受宁静的古老森林' },
  { id: 4, title: '城市 (City)', color: 'pink', content: '体验繁华都市的脉搏' },
];

// Individual Card Component
const Item = ({ id, title, color, setSelectedId }) => {
  return (
    <motion.div
      layoutId={id}
      onClick={() => setSelectedId(id)}
      className={`${styles.card} ${styles[color]}`}
    >
      <motion.h2 className={styles.cardTitle} layoutId={`title-${id}`}>{title}</motion.h2>
      <motion.p className={styles.cardSubtitle} layoutId={`subtitle-${id}`}>
        点击查看详情
      </motion.p>
    </motion.div>
  );
};

// Expanded Card Component
const ExpandedItem = ({ id, title, content, color, setSelectedId }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedId(null)}
      className={styles.backdrop}
    >
      <motion.div
        layoutId={id}
        className={`${styles.expandedCard} ${styles[color]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h2 className={styles.expandedTitle} layoutId={`title-${id}`}>
          {title}
        </motion.h2>
        <motion.p className={styles.expandedContent} layoutId={`subtitle-${id}`}>
          {content}
        </motion.p>
        <p className={styles.description}>
          这是一个使用 Framer Motion layout 属性实现的神奇动画。
          当组件状态改变时（从网格项到全屏项），Framer Motion 会自动计算并平滑过渡它的位置和大小。
        </p>
        <button onClick={() => setSelectedId(null)} className={styles.closeButton}>
          关闭
        </button>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
const FramerMotionApp = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedItem = initialItems.find(item => item.id === selectedId);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Framer Motion 布局魔术 (Layout Magic)</h1>

      <LayoutGroup  type="crossfade">
        <div className={styles.grid}>
          {initialItems.map(item => (
            item.id !== selectedId && (
              <Item
                key={item.id}
                {...item}
                setSelectedId={setSelectedId}
              />
            )
          ))}
        </div>

        {selectedItem && (
          <ExpandedItem
            {...selectedItem}
            setSelectedId={setSelectedId}
          />
        )}
      </LayoutGroup >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default FramerMotionApp;
