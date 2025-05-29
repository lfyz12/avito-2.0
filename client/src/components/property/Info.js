import React from 'react';
import {FaBed, FaBuilding, FaMapMarkerAlt, FaRulerCombined} from "react-icons/fa";

const Info = ({property}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Информация о недвижимости</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <FaBed className="text-blue-600"/>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">Комнат</div>
                        <div className="font-medium">{property.rooms}</div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <FaRulerCombined className="text-blue-600"/>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">Площадь</div>
                        <div className="font-medium">{property.area} м²</div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <FaBuilding className="text-blue-600"/>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">Этаж</div>
                        <div className="font-medium">{property.floor}/{property.totalFloors}</div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <FaMapMarkerAlt className="text-blue-600"/>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">Район</div>
                        <div className="font-medium">{property.district || 'Не указан'}</div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Описание</h3>
                <p className="text-gray-700 whitespace-pre-line">
                    {property.description || 'Описание отсутствует.'}
                </p>
            </div>
        </div>
    );
};

export default Info;