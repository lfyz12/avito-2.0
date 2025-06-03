// Profile.jsx
import React, {useState, useContext, useEffect, useRef} from 'react';
import { observer } from 'mobx-react-lite';
import {useNavigate, useParams} from "react-router-dom";
import {HOMEROUTER, PROFILEROUTER} from "../utils/consts";
import CreatePropertyForm from "../components/CreatePropertyForm";
import PropertyCard from "../components/PropertyCard";
import Like from "./Like";
import OwnerBookings from "../components/OwnerBookings";
import UserBookings from "../components/UserBookings";
import {Context} from "../index";

const Profile = observer(() => {
    const [activeTab, setActiveTab] = useState('profile');
    const { userStore, propertyStore, reviewStore, bookingStore } = useContext(Context);
    const navigate = useNavigate();
    const {tab} = useParams()





    // useEffect(() => {
    //     if (tab === 'lk') {
    //         setActiveTab('profile')
    //     } else if (tab === 'create') {
    //         setActiveTab('create')
    //     }
    // })

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
                        onClick={() => {
                            navigate(PROFILEROUTER + '/lk')
                            setActiveTab('profile')
                        }}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'profile'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Личный кабинет
                    </button>
                    {userStore.user.role === 'owner' && <button
                        onClick={() => {
                            navigate(PROFILEROUTER + '/create')
                            setActiveTab('create')
                        }}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'create'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Добавить объявление
                    </button>}

                    <button
                        onClick={() => {
                            navigate(PROFILEROUTER + '/like')
                            setActiveTab('like')
                        }}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'like'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Понравившиеся объявления
                    </button>

                    <button
                        onClick={() => {
                            navigate(userStore.user.role === 'owner' ? PROFILEROUTER + '/owners' : PROFILEROUTER + '/clients' )
                            setActiveTab(userStore.user.role === 'owner' ? 'owners': 'clients')
                        }}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            (activeTab === 'owners' || activeTab === 'clients') 
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Заявки на бронирвоание
                    </button>

                </nav>
            </div>

            {/* Содержимое табов */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {tab === 'lk' ? (
                    <div>
                        {/* Информация о пользователе */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Мой профиль</h2>

                            {/* Блок с аватаром */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                {userStore.user?.avatar ? (
                                        <img
                                            src={process.env.REACT_APP_API_URL + 'static/' + userStore.user.avatar}
                                            alt="Аватар"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div
                                            className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                    )}

                                    {/* Кнопка загрузки аватара */}
                                    <label
                                        className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer group-hover:opacity-100 opacity-90 transition-opacity">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    await userStore.updateProfile(file);
                                                    // Добавляем timestamp к URL, чтобы обойти кэширование
                                                    e.target.value = null;
                                                }
                                            }}
                                        />

                                    </label>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mt-3">{userStore.user?.name}</h3>
                                <p className="text-gray-600">{userStore.user?.role === 'owner' ? 'Арендодатель' : 'Клиент'}</p>
                            </div>

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
                                            <span className="text-gray-500">Телефон:</span>
                                            <span className="font-medium">
                        {userStore.user?.phone || 'Не указан'}
                                                {!userStore.user?.phone && (
                                                    <button
                                                        onClick={() => {
                                                            const newPhone = prompt('Введите ваш телефон:');
                                                            if (newPhone) {
                                                                userStore.updateProfile({phone: newPhone});
                                                            }
                                                        }}
                                                        className="ml-2 text-blue-600 text-sm hover:underline"
                                                    >
                                                        Добавить
                                                    </button>
                                                )}
                    </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Роль:</span>
                                            <span className="font-medium capitalize">
                        {userStore.user?.role === 'owner' ? 'Арендодатель' : 'Клиент'}
                    </span>
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
                                            <span className="text-gray-500">Активных:</span>
                                            <span className="font-medium">
                        {propertyStore.myProperties.filter(p => p.isActive).length}
                    </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Дата регистрации:</span>
                                            <span className="font-medium">
                        {userStore.user?.createdAt
                            ? new Date(userStore.user.createdAt).toLocaleDateString()
                            : 'Неизвестно'}
                    </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Отзывов:</span>
                                            <span className="font-medium">
                        {reviewStore.myReviews.length}
                    </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Мои объявления */}
                        {userStore.user.role === "owner" && <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Мои объявления</h2>
                            {propertyStore.myProperties.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {propertyStore.myProperties.map(property => (
                                        <div>
                                            <PropertyCard key={property.id} property={property}/>
                                            <button onClick={() => propertyStore.delete(property.id)} className='text-white w-full py-2 bg-red-500 rounded-3xl mt-2 font-medium hover:bg-red-600 '>Удалить</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
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
                        </div>}
                    </div>
                ) : tab === 'like' ?
                    <Like/> : tab === 'owners' ? <OwnerBookings/> : tab === 'clients' ? <UserBookings/> :(
                    <CreatePropertyForm/>
                )}
            </div>
        </div>
    );
});

export default Profile;