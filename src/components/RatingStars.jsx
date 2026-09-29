import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, reviewsCount, showCount = true, size = 'sm' }) => {
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  const starSizeClass = starSizes[size] || starSizes.sm;

  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(rating);
          const isHalf = star === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <Star
              key={star}
              className={`${starSizeClass} ${
                isFilled || isHalf
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700'
              }`}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {rating.toFixed(1)} {reviewsCount !== undefined && `(${reviewsCount})`}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
