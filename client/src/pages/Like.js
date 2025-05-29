import React, {useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import {Context} from "../index";
import PropertyCard from "../components/PropertyCard"; // Предполагается, что у вас есть компонент карточки

const Like = observer(() => {
    const { likeStore } = useContext(Context);

    useEffect(() => {
        likeStore.fetchLikedProperties();
    }, []);

    const handleRemove = (propertyId) => {
        likeStore.removeFromLiked(propertyId);
    };

    if (likeStore.loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (likeStore.error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{likeStore.error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Избранные объявления</h1>

            {likeStore.likedProperties.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Пусто</h3>
                    <p className="mt-1 text-gray-500">В избранном пока ничего нет</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {likeStore.likedProperties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default Like;