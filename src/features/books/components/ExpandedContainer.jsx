import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import styles from './ExpandedContainer.module.css';

const CONTAINER_DURATION = 500; // 动画时长

export default function ExpandedContainer({ expanded, children }) {
  const containerRef = useRef(null);

  const onEnter = () => {
    const node = containerRef.current;
    if (!node) return;
    node.style.height = '0';
    node.style.opacity = '0';
    node.style.transform = 'scaleY(0.9)';
  };

  const onEntering = () => {
    const node = containerRef.current;
    if (!node) return;
    const scrollHeight = node.scrollHeight;
    node.style.height = `${scrollHeight}px`;
    node.style.opacity = '1';
    node.style.transform = 'scaleY(1)';
    node.style.transition = `
      height ${CONTAINER_DURATION}ms ease-in-out,
      opacity ${CONTAINER_DURATION}ms ease-in-out,
      transform ${CONTAINER_DURATION}ms ease-in-out
    `;
  };

  const onEntered = () => {
    const node = containerRef.current;
    if (!node) return;
    node.style.height = 'auto';
    node.style.transition = '';
  };

  const onExit = () => {
    const node = containerRef.current;
    if (!node) return;
    node.style.height = `${node.scrollHeight}px`;
    node.style.transition = `
      height ${CONTAINER_DURATION}ms ease-in-out,
      opacity ${CONTAINER_DURATION}ms ease-in-out,
      transform ${CONTAINER_DURATION}ms ease-in-out
    `;
  };

  const onExiting = () => {
    const node = containerRef.current;
    if (!node) return;
    node.style.height = '0';
    node.style.opacity = '0';
    node.style.transform = 'scaleY(0.9)';
  };

  return (
    <Transition
      in={expanded}
      timeout={CONTAINER_DURATION}
      onEnter={onEnter}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      unmountOnExit
      nodeRef={containerRef}
    >
      <div ref={containerRef} className={styles.container}>
        {children}
      </div>
    </Transition>
  );
}
