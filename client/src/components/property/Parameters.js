import React from 'react';

const Parameters = ({property}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Характеристики</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Тип недвижимости</span>
                    <span className="font-medium">
                                    {property.type === 'apartment' ? 'Квартира' :
                                        property.type === 'house' ? 'Дом' : 'Комната'}
                                </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Тип дома</span>
                    <span className="font-medium">{property.houseType || 'Не указано'}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Год постройки</span>
                    <span className="font-medium">{property.yearBuilt || 'Не указан'}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Площадь кухни</span>
                    <span className="font-medium">{property.kitchenArea || 'Не указана'} м²</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Санузел</span>
                    <span className="font-medium">{property.bathroom || 'Не указано'}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Балкон/лоджия</span>
                    <span className="font-medium">{property.balcony ? 'Есть' : 'Нет'}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Ремонт</span>
                    <span className="font-medium">{property.renovation || 'Не указан'}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Мебель</span>
                    <span className="font-medium">{property.furniture ? 'Есть' : 'Нет'}</span>
                </div>
            </div>
        </div>
    );
};

export default Parameters;