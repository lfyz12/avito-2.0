import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../index';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import StarRating from "./Review/StarRating";
import TotalRating from "./Review/TotalRating";
import AddReview from "./Review/AddReview";



const ReviewsSection = observer(({ propertyId }) => {
    const { reviewStore, userStore } = useContext(Context);
    const [newReview, setNewReview] = useState({ rating: 5, text: '' });
    const [expandedReview, setExpandedReview] = useState(null);

    // Проверяем, оставлял ли текущий пользователь отзыв
    const userReview = reviewStore.reviews.find(
        review => review.authorId === userStore.user?.id
    );

    // Расчет среднего рейтинга
    const averageRating = reviewStore.reviews.length > 0
        ? reviewStore.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewStore.reviews.length
        : 0;

    // Распределение рейтингов
    const ratingDistribution = Array(5).fill(0).map((_, i) => {
        const star = 5 - i;
        const count = reviewStore.reviews.filter(r => Math.floor(r.rating) === star).length;
        const percentage = reviewStore.reviews.length > 0
            ? (count / reviewStore.reviews.length) * 100
            : 0;

        return { star, count, percentage };
    });

    useEffect(() => {
        reviewStore.fetchReviewsForProperty(propertyId);
    }, [propertyId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await reviewStore.createReview({
                propertyId,
                rating: newReview.rating,
                text: newReview.text
            });
            setNewReview({ rating: 5, text: '' });
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
        }
    };

    const handleDeleteReview = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить отзыв?')) {
            await reviewStore.deleteReview(id);
        }
    };

    const toggleReviewExpansion = (id) => {
        setExpandedReview(expandedReview === id ? null : id);
    };

    const onNewRating = (rating) => {
        setNewReview({...newReview, rating})
    }

    const onNewText = (text) => {
        setNewReview({...newReview, text})
    }

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Отзывы и оценки</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Левая колонка: Общий рейтинг */}
               <TotalRating reviews={reviewStore.reviews} averageRating={averageRating} ratingDistribution={ratingDistribution}/>

                {/* Правая колонка: Форма отзыва и список отзывов */}
                <div className="lg:col-span-2">
                    {/* Форма добавления отзыва */}
                    {userStore.isAuth && !userReview && (
                        <AddReview isLoading={reviewStore.isLoading} newReview={newReview} handleSubmitReview={handleSubmitReview} onNewRating={onNewRating} onNewText={onNewText}/>
                    )}

                    {/* Отзыв текущего пользователя */}
                    {userReview && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Ваш отзыв</h3>
                                <button
                                    onClick={() => handleDeleteReview(userReview.id)}
                                    className="text-red-500 hover:text-red-700 flex items-center"
                                >
                                    <FaTrash className="mr-1" /> Удалить
                                </button>
                            </div>

                            <div className="flex items-start">
                                <div className="mr-4 w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg">
                                    {userStore.user?.avatar ?  <img
                                        src={process.env.REACT_APP_API_URL + 'static/' + userStore.user.avatar}
                                        alt="Аватар"
                                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                    /> : <FaUserCircle className="text-4xl text-gray-400"/>}
                                        </div>

                                        <div className="flex-1">
                                        <div className="flex justify-between">
                                        <div>
                                        <div className="font-medium text-gray-900">{userStore.user?.name}</div>
                                <div className="text-sm text-gray-500">
                                                {format(new Date(userReview.createdAt), 'dd MMMM yyyy', { locale: ru })}
                                            </div>
                                        </div>
                                        <StarRating rating={userReview.rating} readOnly={true} />
                                    </div>

                                    <p className="mt-3 text-gray-700 whitespace-pre-line">
                                        {userReview.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Список отзывов */}
                    <div className="space-y-6">
                        {reviewStore.reviews
                            .filter(review => review.id !== (userReview?.id || null))
                            .map(review => (
                                <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-start">
                                        <div className="mr-4 w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg">
                                            {review.author.avatar ?  <img
                                                src={process.env.REACT_APP_API_URL + 'static/' + review.author.avatar}
                                                alt="Аватар"
                                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                            /> : <FaUserCircle className="text-4xl text-gray-400"/>}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium text-gray-900">{review.author?.name || 'Аноним'}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: ru })}
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} readOnly={true} />
                                            </div>

                                            <p className={`mt-3 text-gray-700 ${expandedReview === review.id || review.text.length < 300 ? '' : 'line-clamp-3'}`}>
                                                {review.text}
                                            </p>

                                            {review.text.length > 300 && (
                                                <button
                                                    onClick={() => toggleReviewExpansion(review.id)}
                                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    {expandedReview === review.id ? 'Свернуть' : 'Читать полностью'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Сообщение, если отзывов нет */}
                    {reviewStore.reviews.length === 0 && !userReview && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                <FaStar className="text-3xl text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Отзывов пока нет</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Будьте первым, кто поделится своим опытом об этом объекте недвижимости.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ReviewsSection;