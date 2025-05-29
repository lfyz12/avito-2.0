import React, {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { PROPERTYROUTER } from "../utils/consts";
import LazyImage from "./LazyImage";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const PropertyCard = ({ property }) => {
    const { likeStore } = useContext(Context);
    const navigate = useNavigate();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [loadedPhotos, setLoadedPhotos] = useState([]);

    const photos = property.photos?.length
        ? property.photos.map((p) => process.env.REACT_APP_API_URL + 'static/' + p)
        : ["https://via.placeholder.com/300x200"];

    useEffect(() => {
        setLoadedPhotos(new Array(photos.length).fill(false));
    }, [property.id]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (likeStore.isLiked(property.id)) {
            await likeStore.removeFromLiked(property.id);
        } else {
            await likeStore.addToLiked(property.id);
        }
    };

    const handleClick = () => {
        navigate(PROPERTYROUTER + '/' + property.id);
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const nextPhoto = (e) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const handleImageLoad = (index) => {
        setLoadedPhotos(prev => {
            const newLoaded = [...prev];
            newLoaded[index] = true;
            return newLoaded;
        });
    };

    return (
        <div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleClick}
        >
            <div className="relative pb-[70%]">
                <div className="absolute inset-0 w-full h-full">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${currentPhotoIndex === index ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <LazyImage
                                src={photo}
                                alt={`${property.title} - фото ${index + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={() => handleImageLoad(index)}
                                style={{
                                    backgroundColor: loadedPhotos[index] ? 'transparent' : '#f3f4f6'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prevPhoto}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-1 z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextPhoto}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-1 z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {photos.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1 z-10">
                        {photos.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${currentPhotoIndex === index ? 'bg-white' : 'bg-white/50'}`}
                            ></div>
                        ))}
                    </div>
                )}

                <div className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 text-sm font-medium text-gray-800 shadow-sm z-10">
                    {property.type === 'apartment' ? 'Квартира' : 'Дом'}
                </div>

                <button
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm z-10"
                    onClick={toggleLike}
                >
                    <svg
                        className={`w-5 h-5 ${likeStore.isLiked(property.id) ? 'text-red-500' : 'text-gray-500'}`}
                        fill={likeStore.isLiked(property.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{property.title}</h3>
                <p className="text-gray-500 text-sm mt-1 truncate">{property.location}</p>

                <div className="flex items-center mt-3">
                    <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{property.price.toLocaleString()} ₽</p>
                        <p className="text-gray-500 text-sm">{property.rooms}-комн. · {property.area} м²</p>
                    </div>

                    <div className="flex space-x-1">
                        <div className="bg-blue-50 rounded-lg px-2 py-1 text-xs font-medium text-blue-700">
                            {property.floor}/{property.totalFloors} эт.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(PropertyCard);