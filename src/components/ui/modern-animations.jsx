import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Fade In Animation
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  direction = 'up',
  distance = 20,
  className = '' 
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale In Animation
export const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.4,
  scale = 0.8,
  className = '' 
}) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      scale 
    }}
    animate={{ 
      opacity: 1, 
      scale: 1 
    }}
    transition={{ 
      duration, 
      delay,
      ease: "easeOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide In Animation
export const SlideIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  direction = 'left',
  distance = 100,
  className = '' 
}) => {
  const directions = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: -distance },
    down: { y: distance }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = '' 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger Item
export const StaggerItem = ({ 
  children, 
  direction = 'up',
  distance = 20,
  className = '' 
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          ...directions[direction] 
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Bounce In Animation
export const BounceIn = ({ 
  children, 
  delay = 0,
  className = '' 
}) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      scale: 0.3 
    }}
    animate={{ 
      opacity: 1, 
      scale: 1 
    }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Rotate In Animation
export const RotateIn = ({ 
  children, 
  delay = 0,
  rotation = -180,
  className = '' 
}) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      rotate: rotation 
    }}
    animate={{ 
      opacity: 1, 
      rotate: 0 
    }}
    transition={{ 
      duration: 0.6, 
      delay,
      ease: "easeOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Flip Animation
export const Flip = ({ 
  children, 
  delay = 0,
  axis = 'x',
  className = '' 
}) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      [axis === 'x' ? 'rotateX' : 'rotateY']: -90 
    }}
    animate={{ 
      opacity: 1, 
      [axis === 'x' ? 'rotateX' : 'rotateY']: 0 
    }}
    transition={{ 
      duration: 0.6, 
      delay,
      ease: "easeOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Typewriter Effect
export const Typewriter = ({ 
  text, 
  delay = 0,
  speed = 0.05,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: delay + (index * speed),
            duration: 0.1
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Hover Scale Animation
export const HoverScale = ({ 
  children, 
  scale = 1.05,
  className = '' 
}) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: scale - 0.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Floating Animation
export const FloatingElement = ({ 
  children, 
  duration = 3,
  distance = 10,
  className = '' 
}) => (
  <motion.div
    animate={{
      y: [-distance, distance, -distance],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulse Animation
export const Pulse = ({ 
  children, 
  scale = 1.05,
  duration = 2,
  className = '' 
}) => (
  <motion.div
    animate={{
      scale: [1, scale, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Shake Animation
export const Shake = ({ 
  children, 
  trigger = false,
  className = '' 
}) => (
  <motion.div
    animate={trigger ? {
      x: [-10, 10, -10, 10, 0],
    } : {}}
    transition={{
      duration: 0.5,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Loading Dots Animation
export const LoadingDots = ({ 
  size = 8,
  color = 'bg-blue-500',
  className = '' 
}) => (
  <div className={`flex space-x-1 ${className}`}>
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className={`w-${size/4} h-${size/4} rounded-full ${color}`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: index * 0.2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

// Progress Bar Animation
export const AnimatedProgressBar = ({ 
  progress = 0,
  height = 'h-2',
  color = 'bg-blue-500',
  backgroundColor = 'bg-gray-200',
  className = ''
}) => (
  <div className={`w-full ${backgroundColor} rounded-full overflow-hidden ${height} ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ 
        duration: 1.5, 
        ease: "easeOut" 
      }}
      className={`h-full ${color} rounded-full`}
    />
  </div>
);

// Count Up Animation with Currency Formatting
export const CountUp = ({ 
  from = 0,
  to,
  duration = 2,
  className = '',
  formatCurrency = false
}) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(from + (to - from) * easeOut);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [from, to, duration]);

  const formatNumber = (num) => {
    if (formatCurrency) {
      return new Intl.NumberFormat('id-ID').format(num);
    }
    return num.toString();
  };

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {formatNumber(count)}
    </motion.span>
  );
};
