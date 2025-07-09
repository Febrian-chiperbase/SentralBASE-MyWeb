import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced Input with Validation
export const EnhancedInput = ({
  label,
  error,
  success,
  hint,
  type = 'text',
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full px-3 py-2 border rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500',
            success && 'border-green-500 focus:ring-green-500',
            !error && !success && 'border-gray-300',
            type === 'password' && 'pr-10',
            className
          )}
          {...props}
        />
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {/* Status Icons */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error && <X className="w-4 h-4 text-red-500" />}
            {success && <Check className="w-4 h-4 text-green-500" />}
          </div>
        )}
      </div>
      
      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-red-600 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-green-600 text-sm"
          >
            <Check className="w-4 h-4" />
            <span>{success}</span>
          </motion.div>
        )}
        
        {hint && !error && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: focused ? 1 : 0.7 }}
            className="text-gray-500 text-sm"
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Multi-Step Form
export const MultiStepForm = ({ steps, currentStep, onStepChange, children }) => (
  <div className="space-y-6">
    {/* Progress Bar */}
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStepChange(index)}
            className={cn(
              'flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors',
              index === currentStep && 'bg-blue-50',
              index < currentStep && 'text-green-600',
              index > currentStep && 'text-gray-400'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                index === currentStep && 'bg-blue-600 text-white',
                index < currentStep && 'bg-green-600 text-white',
                index > currentStep && 'bg-gray-200 text-gray-500'
              )}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className="text-xs font-medium">{step.title}</span>
          </motion.button>
          
          {index < steps.length - 1 && (
            <div className="flex-1 mx-2">
              <div className="h-0.5 bg-gray-200">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  className="h-full bg-green-600"
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
    
    {/* Form Content */}
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </div>
);

// Floating Label Input
export const FloatingLabelInput = ({ label, value, onChange, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        {...props}
      />
      <motion.label
        animate={{
          top: focused || hasValue ? '0.5rem' : '50%',
          fontSize: focused || hasValue ? '0.75rem' : '1rem',
          color: focused ? '#3B82F6' : '#6B7280'
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-3 transform -translate-y-1/2 pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
};

// Form Validation Hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validate = React.useCallback((fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return '';

    if (rule.required && (!value || value.trim() === '')) {
      return rule.required;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Minimum ${rule.minLength} characters required`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.patternMessage || 'Invalid format';
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return '';
  }, [validationRules]);

  const handleChange = (fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    if (touched[fieldName]) {
      const error = validate(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validate(fieldName, values[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(fieldName => {
      newErrors[fieldName] = validate(fieldName, values[fieldName]);
    });
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.values(newErrors).every(error => !error);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.values(errors).every(error => !error)
  };
};
