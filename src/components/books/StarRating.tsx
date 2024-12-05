import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  editable = false,
  onChange 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= displayRating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          } ${
            editable ? 'cursor-pointer transition-colors duration-150' : ''
          }`}
          onClick={() => editable && onChange?.(star)}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(null)}
        />
      ))}
    </div>
  );
}