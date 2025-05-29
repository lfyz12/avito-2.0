import React, {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

import Slider from "../components/property/Slider";
import PriceBox from "../components/property/PriceBox";
import Info from "../components/property/Info";
import Parameters from "../components/property/Parameters";
import Amenities from "../components/property/Amenities";
import OwnerInfo from "../components/property/OwnerInfo";
import ReviewSection from "../components/ReviewSection";
import ChatModal from "../components/ChatModal";

const PropertyPage = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { propertyStore, userStore, likeStore, chatStore } = useContext(Context);
    const [showPhone, setShowPhone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const openChatModal = () => setIsChatModalOpen(true);
    const closeChatModal = () => setIsChatModalOpen(false);


    const onShow = () => setShowPhone(true)

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            try {
                await propertyStore.fetchById(id);
                setIsLoading(false);
            } catch (err) {
                setError('Не удалось загрузить объявление');
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const property = propertyStore.selectedProperty;



    useEffect(() => {
        likeStore.fetchLikedProperties()
    }, [])

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (likeStore.isLiked(id)) {
            await likeStore.removeFromLiked(id);
        } else {
            await likeStore.addToLiked(id);
        }
    };

    if (userStore.isLoading || propertyStore.isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="h-12 bg-gray-200 rounded mb-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (userStore.error || propertyStore.error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 rounded-xl p-8 max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Ошибка загрузки</h2>
                    <p className="text-gray-600 mb-6">{userStore.error | propertyStore.error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Форматирование цены
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-sm text-gray-500 mb-6">
                <span
                    onClick={() => navigate('/')}
                    className="hover:text-blue-600 cursor-pointer"
                >
                    Главная
                </span>
                {' > '}
                <span
                    onClick={() => navigate(`/category/${property.type}`)}
                    className="hover:text-blue-600 cursor-pointer"
                >
                    {property.type === 'apartment' ? 'Квартиры' : property.type === 'house' ? 'Дома' : 'Комнаты'}
                </span>
                {' > '}
                <span className="text-gray-900">{property.title}</span>
            </div>


            {/* Заголовок и дата */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-0">
                    {property.title}
                </h1>
                <p className="text-gray-500 text-sm">
                    Опубликовано: {formatDate(property.createdAt)}
                </p>
            </div>

            {/* Галерея */}
            <Slider property={property}/>


            {/* Основной контент */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Левая колонка */}
                <div className="lg:col-span-2">

                    {/* Цена и кнопки */}
                    <PriceBox property={property} formatPrice={formatPrice} onShow={onShow} showPhone={showPhone} toggleLike={toggleLike} openChatModal={openChatModal}/>

                    {/* Информация о недвижимости */}
                    <Info property={property}/>

                    {/* Характеристики */}
                    <Parameters property={property}/>

                    {/* Удобства */}
                    {property.amenities && property.amenities.length > 0 && (
                        <Amenities property={property}/>
                    )}
                </div>

                {/* Правая колонка - Информация о продавце */}
               <OwnerInfo onShow={onShow} showPhone={showPhone} property={property}/>
            </div>
            <ReviewSection propertyId={id}/>
            <ChatModal isOpen={isChatModalOpen} onClose={closeChatModal} />
        </div>
    );
});

export default PropertyPage;