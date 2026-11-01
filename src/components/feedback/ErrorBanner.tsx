import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '../ui/Button.tsx';

export interface ErrorBannerProps {
  title: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title,
  message,
  onRetry,
  onDismiss,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 backdrop-blur-md shadow-xl flex items-start justify-between gap-3 font-mono text-xs ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-200 tracking-wide uppercase text-[11px]">{title}</h4>
          <p className="text-[11px] text-red-300/90 font-sans mt-0.5 leading-snug">{message}</p>
          {onRetry && (
            <Button
              variant="danger"
              size="sm"
              onClick={onRetry}
              icon={<RefreshCw className="w-3 h-3" />}
              className="mt-2 text-[10px] py-0.5 px-2"
            >
              RETRY
            </Button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="p-1 rounded text-red-400 hover:text-red-100 hover:bg-red-900/50 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
