import React, {useState} from 'react';
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const renderStar = (index) => {
        const currentRating = hoverRating || rating;
        const fullStars = Math.floor(currentRating);
        const hasHalfStar = currentRating % 1 >= 0.5;

        if (index < fullStars) {
            return <FaStar className="text-yellow-400" />;
        }
        if (index === fullStars && hasHalfStar) {
            return <FaStarHalfAlt className="text-yellow-400" />;
        }
        return <FaRegStar className="text-yellow-400" />;
    };

    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => !readOnly && onRatingChange(index + 1)}
                    onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    className={`${!readOnly ? 'cursor-pointer' : ''} text-xl`}
                    disabled={readOnly}
                >
                    {renderStar(index)}
                </button>
            ))}
            <span className="ml-2 text-lg font-medium text-gray-800">{rating.toFixed(1)}</span>
        </div>
    );
};

export default StarRating;