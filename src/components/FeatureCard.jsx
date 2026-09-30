import React from 'react';
import { Truck, ShieldCheck, RefreshCw, BadgeCheck } from 'lucide-react';

export const FeatureCard = ({ iconName, title, description }) => {
  const getIcon = () => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6 text-zinc-900 dark:text-white" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-white" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-zinc-900 dark:text-white" />;
      case 'BadgeCheck':
      default:
        return <BadgeCheck className="w-6 h-6 text-zinc-900 dark:text-white" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-200/80 dark:border-zinc-800 space-y-4 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
