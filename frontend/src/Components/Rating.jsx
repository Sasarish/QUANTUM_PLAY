import { Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'

//Handling product rating with 5 star
const Rating = ({ value = 0, onRatingChange, disabled = false, showValue = true }) => {

    const [rating, setRating] = useState(value);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(value);
    }, [value]);

    const handleClick = (star) => {
        if (disabled) return;
        setRating(star);
        onRatingChange?.(star);
    }

    return (
        <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = hover ? star <= hover : star <= rating;
                    return <Star size={18} key={star}
                        className={`
                            transition-all duration-200
                            ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                            ${disabled ? "cursor-default" : "cursor-pointer hover:scale-125"}`
                        }
                        onMouseEnter={() => !disabled && setHover(star)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        onClick={() => handleClick(star)}
                    />
                })}
            </div>
            {showValue && <span className='text-xs font-semibold text-gray-500'>{rating}/5</span>}
        </div>
    )
}

export default Rating