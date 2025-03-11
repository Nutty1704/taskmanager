import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FadeIn = ({
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = null, // Can be used for unmount animations
  transition = { duration: 0.6, ease: 'easeOut' },
  triggerOnce = true,
  threshold = 0.5,
  rootMargin = '0px',
  className = '',
  style = {},
  as = 'div', // Allows changing the element type (e.g., 'section', 'span')
  ...props // Allows passing additional motion.div props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce, threshold, rootMargin });

  return React.createElement(
    motion[as], // Allows dynamic tag elements
    {
      ref,
      initial,
      animate: isInView ? animate : {},
      exit,
      transition,
      className,
      style,
      ...props,
    },
    children
  );
};

export default FadeIn;
