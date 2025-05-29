import React, {useEffect, useState} from "react";

const SearchFilters = ({ onFilterChange, initialFilters }) => {
    const [filters, setFilters] = useState(initialFilters);
    const [showAmenities, setShowAmenities] = useState(false);

    const amenitiesList = [
        "Wi-Fi", "Кондиционер", "Балкон", "Мебель",
        "Стиральная машина", "Парковка", "Лифт", "Кухня"
    ];

    // Применяем фильтры с задержкой 500мс
    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange(filters);
        }, 500);

        return () => clearTimeout(handler);
    }, [filters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleAmenity = (amenity) => {
        setFilters(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];

            return {
                ...prev,
                amenities
            };
        });
    };

    const handleSearchClick = () => {
        // Принудительно применяем фильтры при нажатии кнопки "Найти"
        onFilterChange(filters);
    };

    return (
        <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-12">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        name="location"
                        placeholder="Город, район или улица"
                        value={filters.location || ""}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAmenities(!showAmenities)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center transition"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Удобства
                    </button>
                    <button
                        onClick={handleSearchClick}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Найти
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                <select
                    name="type"
                    value={filters.type || ""}
                    onChange={handleInputChange}
                    className="w-full sm:w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">Тип жилья</option>
                    <option value="apartment">Квартира</option>
                    <option value="house">Дом</option>
                    <option value="room">Комната</option>
                </select>

                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Цена от"
                        value={filters.minPrice || ""}
                        onChange={handleInputChange}
                        className="w-full sm:w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="до"
                        value={filters.maxPrice || ""}
                        onChange={handleInputChange}
                        className="w-full sm:w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <select
                    name="rooms"
                    value={filters.rooms || ""}
                    onChange={handleInputChange}
                    className="w-full sm:w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">Комнат</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                </select>
            </div>

            {showAmenities && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Удобства</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {amenitiesList.map((amenity) => (
                            <label key={amenity} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={filters.amenities?.includes(amenity) || false}
                                    onChange={() => toggleAmenity(amenity)}
                                />
                                <div className={`w-5 h-5 flex items-center justify-center mr-2 border rounded ${filters.amenities?.includes(amenity) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {filters.amenities?.includes(amenity) && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-gray-700">{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchFilters;