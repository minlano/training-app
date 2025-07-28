import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button'
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white border border-green-500"
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  )
}

interface IconButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseStyles = "rounded-full transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 flex items-center justify-center"
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white border border-green-500"
  }

  const sizeStyles = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10",
    lg: "w-12 h-12 text-lg"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  )
} 