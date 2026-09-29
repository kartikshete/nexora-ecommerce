import React from 'react';
import { useShop } from '../hooks/useShop';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useShop();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
      <div className="flex items-center space-x-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-3.5 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200">
        {getIcon()}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
