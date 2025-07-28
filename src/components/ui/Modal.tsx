import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: 'warning' | 'danger' | 'info'
  confirmText?: string
  cancelText?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,

  confirmText = '확인',
  cancelText = '취소'
}) => {
  if (!isOpen) return null

  const modalStyles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    },
    modal: {
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      border: '1px solid #374151',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      position: 'relative' as const
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '16px',
      textAlign: 'center' as const
    },
    message: {
      fontSize: '14px',
      color: '#d1d5db',
      lineHeight: '1.6',
      whiteSpace: 'pre-line' as const,
      marginBottom: '24px',
      textAlign: 'center' as const
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center' as const
    },
    button: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    confirmButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    cancelButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    }
  }

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={modalStyles.title}>{title}</h3>
        <div style={modalStyles.message}>{message}</div>
        <div style={modalStyles.buttonContainer}>
          {onConfirm && (
            <button
              style={{ ...modalStyles.button, ...modalStyles.confirmButton }}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
          <button
            style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
} 