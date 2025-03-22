import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Button({ 
  children, 
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  fullWidth = false,
  href,
  type = 'button',
  isAnimated = true,
  disabled = false,
  onClick,
  className = '',
  isLoading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  iconSize = 'w-5 h-5',
  ...props 
}) {
  const baseStyles = "rounded-full font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-secondary text-primary hover:bg-secondary-light hover:shadow-lg",
    secondary: "bg-background-alt hover:bg-secondary/10",
    outline: "border border-secondary/20 hover:bg-secondary/10",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg",
    success: "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg",
    ghost: "bg-transparent hover:bg-secondary/5",
    link: "p-0 underline-offset-4 hover:underline text-accent",
    gradient: "bg-gradient-to-r from-secondary to-accent text-primary hover:shadow-lg"
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-4 text-lg"
  };

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
    ${isLoading ? 'cursor-wait' : ''}
  `.trim();

  const MotionComponent = isAnimated ? motion.button : 'button';
  const animationProps = isAnimated ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  if (href) {
    return (
      <Link to={href}>
        <MotionComponent
          className={`flex items-center gap-2 ${buttonClasses}`}
          {...animationProps}
          {...props}
        >
          {leftIcon && <span className={iconSize}>{leftIcon}</span>}
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                {/* Spinner SVG */}
              </svg>
              {loadingText}
            </div>
          ) : children}
          {rightIcon && <span className={iconSize}>{rightIcon}</span>}
        </MotionComponent>
      </Link>
    );
  }

  return (
    <MotionComponent
      type={type}
      className={`flex items-center gap-2 ${buttonClasses}`}
      onClick={onClick}
      disabled={isLoading || disabled}
      {...animationProps}
      {...props}
    >
      {leftIcon && <span className={iconSize}>{leftIcon}</span>}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            {/* Spinner SVG */}
          </svg>
          {loadingText}
        </div>
      ) : children}
      {rightIcon && <span className={iconSize}>{rightIcon}</span>}
    </MotionComponent>
  );
} 