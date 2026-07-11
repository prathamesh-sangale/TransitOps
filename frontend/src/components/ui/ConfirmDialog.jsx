import React from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel', 
  onConfirm, 
  onCancel, 
  variant = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm"
        onClick={!isLoading ? onCancel : undefined}
      />
      
      {/* Dialog */}
      <div className="bg-surface rounded-lg shadow-xl border border-border-subtle w-full max-w-md relative z-10 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-secondary">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-secondary px-6 py-4 flex justify-end gap-3 border-t border-border-subtle">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
