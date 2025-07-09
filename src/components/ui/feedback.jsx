import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsUp, Star, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Like Button with Animation
export const LikeButton = ({ liked, onToggle, count = 0 }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onToggle}
    className={cn(
      'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors',
      liked 
        ? 'bg-red-100 text-red-600' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    )}
  >
    <motion.div
      animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Heart 
        className={cn('w-4 h-4', liked && 'fill-current')} 
      />
    </motion.div>
    <span className="text-sm font-medium">{count}</span>
  </motion.button>
);

// Star Rating Component
export const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={!readonly ? { scale: 1.1 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={cn(
            'transition-colors',
            !readonly && 'hover:text-yellow-400 cursor-pointer'
          )}
        >
          <Star
            className={cn(
              'w-5 h-5',
              (hoverRating >= star || rating >= star)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
};

// Thumbs Up/Down Component
export const ThumbsVote = ({ upvotes = 0, downvotes = 0, userVote, onVote }) => (
  <div className="flex items-center space-x-4">
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onVote('up')}
      className={cn(
        'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors',
        userVote === 'up'
          ? 'bg-green-100 text-green-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    >
      <ThumbsUp className="w-4 h-4" />
      <span className="text-sm font-medium">{upvotes}</span>
    </motion.button>
    
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onVote('down')}
      className={cn(
        'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors',
        userVote === 'down'
          ? 'bg-red-100 text-red-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    >
      <ThumbsUp className="w-4 h-4 rotate-180" />
      <span className="text-sm font-medium">{downvotes}</span>
    </motion.button>
  </div>
);

// Floating Action Button
export const FloatingActionButton = ({ onClick, icon, label, className }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={cn(
      'fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50',
      className
    )}
    title={label}
  >
    {icon}
  </motion.button>
);

// Progress Indicator
export const ProgressIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center justify-between">
    {steps.map((step, index) => (
      <React.Fragment key={step.id}>
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: index <= currentStep ? 1 : 0.8,
              backgroundColor: index <= currentStep ? '#3B82F6' : '#E5E7EB'
            }}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              index <= currentStep ? 'text-white' : 'text-gray-500'
            )}
          >
            {index + 1}
          </motion.div>
          <span className="text-xs mt-2 text-gray-600">{step.label}</span>
        </div>
        {index < steps.length - 1 && (
          <div className="flex-1 mx-4">
            <div className="h-0.5 bg-gray-200 relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ 
                  width: index < currentStep ? '100%' : '0%'
                }}
                transition={{ duration: 0.5 }}
                className="h-full bg-blue-600"
              />
            </div>
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// Pulse Effect for Notifications
export const PulseNotification = ({ children, pulse = false }) => (
  <motion.div
    animate={pulse ? {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(59, 130, 246, 0.7)',
        '0 0 0 10px rgba(59, 130, 246, 0)',
        '0 0 0 0 rgba(59, 130, 246, 0)'
      ]
    } : {}}
    transition={{
      duration: 2,
      repeat: pulse ? Infinity : 0,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);
