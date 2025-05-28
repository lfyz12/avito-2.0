// Profile.jsx
import React, {useState, useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { HOMEROUTER } from "../utils/consts";
import CreatePropertyForm from "../components/CreatePropertyForm";
import PropertyCard from "../components/PropertyCard";

const Profile = observer(() => {
    const [activeTab, setActiveTab] = useState('profile');
    const { userStore, propertyStore } = useContext(Context);
    const navigate = useNavigate();

    // Загрузка объявлений пользователя
    useEffect(() => {
        if (userStore.isAuth && activeTab === 'profile') {
            propertyStore.fetchMy();
        }
    }, [activeTab, userStore.isAuth]);

    const handleLogout = async () => {
        await userStore.logout();
        navigate(HOMEROUTER);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
                <button
                    onClick={handleLogout}
                    className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center transition"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти
                </button>
            </div>

            {/* Навигация по табам */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'profile'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Личный кабинет
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'create'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Добавить объявление
                    </button>
                </nav>
            </div>

            {/* Содержимое табов */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {activeTab === 'profile' ? (
                    <div>
                        {/* Информация о пользователе */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Мой профиль</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Основная информация</h3>
                                    <div className="space-y-2">
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Имя:</span>
                                            <span className="font-medium">{userStore.user?.name || 'Не указано'}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Email:</span>
                                            <span className="font-medium">{userStore.user?.email || 'Не указан'}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Роль:</span>
                                            <span className="font-medium capitalize">{userStore.user?.role || 'Пользователь'}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Статистика</h3>
                                    <div className="space-y-2">
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Объявлений:</span>
                                            <span className="font-medium">{propertyStore.myProperties.length}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Дата регистрации:</span>
                                            <span className="font-medium">
                                                {userStore.user?.createdAt ? new Date(userStore.user.createdAt).toLocaleDateString() : 'Неизвестно'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Мои объявления */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Мои объявления</h2>
                            {propertyStore.myProperties.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {propertyStore.myProperties.map(property => (
                                        <PropertyCard key={property.id} property={property} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-gray-500 mb-2">У вас пока нет объявлений</p>
                                    <button
                                        onClick={() => setActiveTab('create')}
                                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                                    >
                                        Создать первое объявление
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <CreatePropertyForm />
                )}
            </div>
        </div>
    );
});

export default Profile;