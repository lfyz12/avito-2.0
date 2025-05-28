// PropertyCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { HOMEROUTER } from "../utils/consts";

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${HOMEROUTER}/property/${property.id}`);
    };

    return (
        <div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleClick}
        >
            <div className="relative pb-[70%]">
                <img
                    src={process.env.REACT_APP_API_URL + 'static/' + property.photos?.[0] || "https://via.placeholder.com/300x200"}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 text-sm font-medium text-gray-800 shadow-sm">
                    {property.type === 'apartment' ? 'Квартира' : 'Дом'}
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
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

export default PropertyCard;