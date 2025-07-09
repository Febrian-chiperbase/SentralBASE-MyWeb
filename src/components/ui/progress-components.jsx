import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Circular Progress Component
export const CircularProgress = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  className,
  showPercentage = true,
  color = 'blue'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colors = {
    blue: 'stroke-blue-600',
    green: 'stroke-green-600',
    orange: 'stroke-orange-600',
    red: 'stroke-red-600'
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={colors[color]}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-2xl font-bold text-gray-900"
            >
              {progress}%
            </motion.div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Linear Progress Bar
export const LinearProgress = ({ 
  progress, 
  height = 8, 
  className,
  showLabel = false,
  label = '',
  color = 'blue'
}) => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
      )}
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn('h-full rounded-full', colors[color])}
        />
      </div>
    </div>
  );
};

// Phase Progress Card
export const PhaseProgressCard = ({ phase, isActive = false }) => {
  const getStatusIcon = () => {
    switch (phase.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (phase.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'border rounded-lg p-4 transition-all duration-200',
        getStatusColor(),
        isActive && 'ring-2 ring-blue-500 ring-opacity-50'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-semibold text-gray-900">{phase.name}</h4>
            <p className="text-sm text-gray-600">{phase.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{phase.progress}%</div>
          <div className="text-xs text-gray-500">
            {phase.estimatedDuration} hari
          </div>
        </div>
      </div>

      <LinearProgress 
        progress={phase.progress} 
        height={6}
        color={phase.status === 'completed' ? 'green' : 'blue'}
      />

      {/* Task List */}
      <div className="mt-4 space-y-2">
        {phase.tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-center space-x-2 text-sm">
            <div className={cn(
              'w-4 h-4 rounded-full flex items-center justify-center',
              task.completed ? 'bg-green-600' : 'bg-gray-300'
            )}>
              {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <span className={cn(
              task.completed ? 'text-gray-600 line-through' : 'text-gray-800'
            )}>
              {task.name}
            </span>
          </div>
        ))}
        {phase.tasks.length > 3 && (
          <div className="text-xs text-gray-500 ml-6">
            +{phase.tasks.length - 3} tugas lainnya
          </div>
        )}
      </div>

      {/* Dates */}
      {(phase.startDate || phase.completedDate) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            {phase.startDate && (
              <span>Mulai: {new Date(phase.startDate).toLocaleDateString('id-ID')}</span>
            )}
            {phase.completedDate && (
              <span>Selesai: {new Date(phase.completedDate).toLocaleDateString('id-ID')}</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Timeline Component
export const ProjectTimeline = ({ phases }) => {
  return (
    <div className="relative">
      {phases.map((phase, index) => (
        <div key={phase.id} className="relative flex items-start mb-8">
          {/* Timeline line */}
          {index < phases.length - 1 && (
            <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-300" />
          )}
          
          {/* Timeline dot */}
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center mr-4 z-10',
            phase.status === 'completed' ? 'bg-green-600' :
            phase.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-300'
          )}>
            {phase.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : phase.status === 'in-progress' ? (
              <Play className="w-4 h-4 text-white" />
            ) : (
              <Clock className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                <span className="text-sm font-medium text-gray-600">
                  {phase.progress}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
              
              <LinearProgress 
                progress={phase.progress} 
                height={4}
                color={phase.status === 'completed' ? 'green' : 'blue'}
              />
              
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Estimasi: {phase.estimatedDuration} hari</span>
                {phase.completedDate && (
                  <span>Selesai: {new Date(phase.completedDate).toLocaleDateString('id-ID')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Milestone Card
export const MilestoneCard = ({ milestone, daysRemaining }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">Milestone Berikutnya</h3>
            <p className="text-blue-100">{milestone?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{daysRemaining}</div>
          <div className="text-sm text-blue-100">hari lagi</div>
        </div>
      </div>
      
      <div className="bg-white/20 rounded-lg p-3">
        <p className="text-sm text-blue-100 mb-2">{milestone?.description}</p>
        <LinearProgress 
          progress={milestone?.progress || 0} 
          height={4}
          color="white"
        />
      </div>
    </div>
  );
};
