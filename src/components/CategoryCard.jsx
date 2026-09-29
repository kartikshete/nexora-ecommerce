import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import {
  Smartphone,
  Shirt,
  Footprints,
  Watch,
  Home as HomeIcon,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const CategoryCard = ({ category }) => {
  const { setSelectedCategory } = useShop();
  const navigate = useNavigate();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6" />;
      case 'Watch':
        return <Watch className="w-6 h-6" />;
      case 'Home':
        return <HomeIcon className="w-6 h-6" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const handleClick = () => {
    setSelectedCategory(category.id);
    navigate('/products');
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-zinc-900 dark:text-white group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors duration-300">
            {getIcon(category.iconName)}
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 group-hover:text-black dark:group-hover:text-white group-hover:bg-gray-200 dark:group-hover:bg-zinc-700 transition-all">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Footer Item Count */}
        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-gray-400 dark:text-zinc-500 border-t border-gray-100 dark:border-zinc-800/60">
          <span>{category.count}+ Products</span>
          <span className="text-[11px] uppercase tracking-wider text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
            Explore →
          </span>
        </div>

      </div>
    </div>
  );
};

export default CategoryCard;
