import React from 'react';
import StarRating from "./StarRating";

const AddReview = ({handleSubmitReview, newReview, isLoading, onNewRating, onNewText}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Оставить отзыв</h3>

            <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ваша оценка
                    </label>
                    <StarRating
                        rating={newReview.rating}
                        onRatingChange={(rating) => onNewRating(rating)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ваш отзыв
                    </label>
                    <textarea
                        value={newReview.text}
                        onChange={(e) => onNewText(e.target.value)}
                        placeholder="Расскажите о вашем опыте..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-h-[120px]"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    {isLoading ? 'Отправка...' : 'Отправить отзыв'}
                </button>
            </form>
        </div>
    );
};

export default AddReview;