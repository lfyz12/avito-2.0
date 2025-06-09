import React, {useContext} from 'react';
import {FaMapMarkerAlt, FaPhone} from "react-icons/fa";
import {Context} from "../../index";

const OwnerInfo = ({property, showPhone, onShow}) => {
    const {userStore} = useContext(Context)
    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Продавец</h2>

                <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-full">
                        <img
                            src={process.env.REACT_APP_API_URL + 'static/' + property.owner.avatar}
                            alt="Аватар"
                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <div className="ml-4">
                        <div className="font-medium text-gray-900">{property.owner?.name || 'Аноним'}</div>
                        <div className="text-gray-500 text-sm">
                            На Avito с {property.owner?.createdAt
                            ? new Date(property.owner.createdAt).getFullYear()
                            : '2023'} года
                        </div>
                    </div>
                </div>

                <button
                    onClick={onShow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition mb-4 flex items-center justify-center"
                >
                    <FaPhone className="mr-2"/>
                    {showPhone ? property.owner?.phone || 'Нет телефона' : 'Показать телефон'}
                </button>

                <button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition flex items-center justify-center mb-6">
                    Написать сообщение
                </button>

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Местоположение</h3>
                    <p className="text-gray-700 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-500"/>
                        {property.location}
                    </p>

                    <div className="mt-4 h-48 bg-gray-100 rounded-lg overflow-hidden">
                        {/* Здесь будет карта */}
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Карта местоположения
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerInfo;