import React from 'react';

const Amenities = ({property}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Удобства</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <span className="text-gray-700">{amenity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Amenities;