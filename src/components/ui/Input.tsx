import React from 'react'

interface InputProps {
  id?: string
  name?: string
  type?: string
  value?: string | number
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  step?: string
  min?: string | number
  max?: string | number
}

export const Input: React.FC<InputProps> = ({ 
  id,
  name,
  type = 'text',
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  className = '',
  step,
  min,
  max
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium" 
          style={{ color: '#d1d5db' }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        step={step}
        min={min}
        max={max}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${className}`}
        style={{ 
          backgroundColor: '#111827', 
          borderColor: '#374151', 
          color: '#ffffff',
          fontSize: '14px'
        }}
      />
    </div>
  )
}

interface SelectProps {
  id?: string
  name?: string
  value?: string | number
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ 
  id,
  name,
  value,
  defaultValue,
  onChange,
  label,
  required = false,
  disabled = false,
  className = '',
  children
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium" 
          style={{ color: '#d1d5db' }}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${className}`}
        style={{ 
          backgroundColor: '#111827', 
          borderColor: '#374151', 
          color: '#ffffff',
          fontSize: '14px'
        }}
      >
        {children}
      </select>
    </div>
  )
}

interface TextAreaProps {
  id?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  className = '',
  rows = 3
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium" 
          style={{ color: '#d1d5db' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${className}`}
        style={{ 
          backgroundColor: '#111827', 
          borderColor: '#374151', 
          color: '#ffffff',
          fontSize: '14px'
        }}
      />
    </div>
  )
} 