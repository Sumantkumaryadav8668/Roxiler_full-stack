import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingInput = ({
    value = 0,
    onChange = () => {},
    readOnly = false,
    size = 22
}) => {
    const [hoverValue, setHoverValue] = useState(0);

    const displayRating = hoverValue || value;

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFilled = starIndex <= displayRating;
                return (
                    <Star
                        key={starIndex}
                        size={size}
                        className={`star ${isFilled ? 'active' : 'inactive'} ${!readOnly ? 'interactive' : ''}`}
                        onClick={() => !readOnly && onChange(starIndex)}
                        onMouseEnter={() => !readOnly && setHoverValue(starIndex)}
                        onMouseLeave={() => !readOnly && setHoverValue(0)}
                        fill={isFilled ? '#f59e0b' : 'none'}
                    />
                );
            })}
        </div>
    );
};

export default RatingInput;
