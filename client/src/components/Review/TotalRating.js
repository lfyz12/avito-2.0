import React from 'react';
import StarRating from "./StarRating";
import {FaStar} from "react-icons/fa";

const TotalRating = ({averageRating, reviews, ratingDistribution}) => {
    return (
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                <StarRating rating={averageRating} readOnly={true}/>
                <div className="text-gray-500 mt-1">
                    {reviews.length} отзывов
                </div>
            </div>

            <div className="space-y-3">
                {ratingDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-15 text-center text-sm text-gray-600">
                            {item.star} <FaStar className="text-yellow-400"/>
                        </div>
                        <div className="flex-1 mx-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{width: `${item.percentage}%`}}
                                ></div>
                            </div>
                        </div>
                        <div className="w-10 text-left text-sm text-gray-600">
                            {item.count}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TotalRating;