// components/booking/BookingCard.jsx
import React, {useState, useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatPrice } from '../utils/helpers';
import {AGREEMENTROUTER, PROPERTYROUTER} from '../utils/consts';
import {Context} from "../index";

const BookingCard = observer(({ booking, isOwner, getStatusText }) => {
    const { bookingStore, userStore, agreementStore } = useContext(Context);
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(booking.status);
    const [owner, setOwner] = useState({});
    // Состояния для оплаты
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    // Состояние для договора
    const [agreementStatus, setAgreementStatus] = useState('not-signed'); // 'not-signed', 'signed', 'loading'
    const [agreement, setAgreement] = useState(null);

    // Ключ для localStorage
    const paymentStorageKey = `booking_payment_${booking.id}`;

    // Проверка статуса оплаты и договора при загрузке компонента
    useEffect(() => {
        userStore.getAllUsers().then(res => {
            setOwner(res.find(u => u.id === booking.Property.ownerId))
        });

        // Проверяем localStorage при загрузке
        const paymentData = localStorage.getItem(paymentStorageKey);
        if (paymentData) {
            const { status } = JSON.parse(paymentData);
            setIsPaid(status === 'success');
        }

        // Загружаем информацию о договоре
        loadAgreementStatus();
    }, [booking.Property.ownerId, paymentStorageKey]);

    const loadAgreementStatus = async () => {
        try {
            setAgreementStatus('loading');
            await agreementStore.fetchAgreementByBooking(booking.id)

            if (!agreementStore.error) {
                setAgreement(agreementStore.agreement);
                setAgreementStatus('signed');
            } else {
                setAgreementStatus('not-signed');
            }
        } catch (e) {
            console.error('Ошибка при загрузке договора:', e);
            setAgreementStatus('not-signed');
        }
    };

    const handleStatusChange = async (e) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);

        if (newStatus !== booking.status) {
            setIsUpdating(true);
            try {
                await bookingStore.updateBookingStatus(booking.id, newStatus);
            } catch (e) {
                console.error('Ошибка при обновлении статуса:', e);
                setSelectedStatus(booking.status);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const getStatusColor = () => {
        switch (booking.status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const navigateToProperty = (e) => {
        e.stopPropagation();
        navigate(`${PROPERTYROUTER}/${booking.Property.id}`);
    };

    const navigateToAgreement = (e) => {
        e.stopPropagation();
        navigate(`${AGREEMENTROUTER}/${booking.id}`);
    };

    const handleOpenPaymentModal = (e) => {
        e.stopPropagation();
        setIsPaymentModalOpen(true);
        setPaymentStatus('');
        setSelectedPaymentMethod('');
    };

    const handlePayment = async (e) => {
        e.stopPropagation();
        if (!selectedPaymentMethod) {
            setPaymentStatus('error');
            return;
        }

        setIsProcessingPayment(true);
        setPaymentStatus('processing');

        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;

            const paymentData = {
                status: isSuccess ? 'success' : 'error',
                method: selectedPaymentMethod,
                amount: booking.totalPrice,
                date: new Date().toISOString(),
                bookingId: booking.id
            };

            localStorage.setItem(paymentStorageKey, JSON.stringify(paymentData));

            setPaymentStatus(isSuccess ? 'success' : 'error');
            setIsProcessingPayment(false);

            if (isSuccess) {
                setIsPaid(true);
                setTimeout(() => {
                    setIsPaymentModalOpen(false);
                }, 2000);
            }
        }, 2000);
    };

    const handleCancelPayment = (e) => {
        e.stopPropagation();
        localStorage.removeItem(paymentStorageKey);
        setIsPaid(false);
        setPaymentStatus('');
        setSelectedPaymentMethod('');
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
            <div className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Изображение объекта */}
                    <div
                        className="w-full md:w-1/3 h-48 rounded-lg overflow-hidden cursor-pointer"
                        onClick={navigateToProperty}
                    >
                        {booking.Property.photos?.length > 0 ? (
                            <img
                                src={`${process.env.REACT_APP_API_URL}static/${booking.Property.photos[0]}`}
                                alt={booking.Property.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                                <span className="text-gray-500">Нет изображения</span>
                            </div>
                        )}
                    </div>

                    {/* Информация о бронировании */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                    onClick={navigateToProperty}
                                >
                                    {booking.Property.title}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {booking.Property.location}
                                </p>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                                    {getStatusText(booking.status)}
                                </div>
                                <div className="text-xl font-bold mt-2">
                                    {formatPrice(booking.totalPrice)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Период бронирования</p>
                                <p className="font-medium">
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} ночей
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    {isOwner ? 'Гость' : 'Владелец'}
                                </p>
                                <p className="font-medium">
                                    {isOwner ? booking.client?.name || 'Неизвестно' : owner?.name || 'Неизвестно'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isOwner ? booking.client?.phone || 'Телефон не указан' : owner?.phone || 'Телефон не указан'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Дата создания</p>
                            <p className="font-medium">
                                {formatDate(booking.createdAt)}
                            </p>
                        </div>

                        {/* Статус договора */}
                        {!isOwner && booking.status === 'confirmed' && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Статус договора</p>
                                {agreementStatus === 'loading' ? (
                                    <div className="flex items-center text-gray-500">
                                        <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                                        Загрузка статуса договора...
                                    </div>
                                ) : agreementStatus === 'signed' ? (
                                    <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span>Договор подписан</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>Договор не подписан</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {isOwner && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Изменить статус</p>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        disabled={isUpdating}
                                        className={`px-3 py-2 rounded-lg border ${
                                            isUpdating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                                        }`}
                                    >
                                        <option value="pending">Новый</option>
                                        <option value="processing">В обработке</option>
                                        <option value="confirmed">Подтвержден</option>
                                        <option value="rejected">Отклонен</option>
                                    </select>

                                    {isUpdating && (
                                        <div className="flex items-center text-gray-500">
                                            <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                                            Сохранение...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isOwner && (booking.status === 'pending' || booking.status === 'processing') && (
                            <div className="mt-4">
                                <button
                                    onClick={() => handleStatusChange({ target: { value: 'canceled' } })}
                                    disabled={isUpdating}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        isUpdating
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {isUpdating ? 'Обработка...' : 'Отменить бронирование'}
                                </button>
                            </div>
                        )}

                        {/* Кнопки для клиента при подтвержденном бронировании */}
                        {!isOwner && booking.status === 'confirmed' && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {/* Кнопка подписания договора */}
                                {agreementStatus !== 'signed' && (
                                    <button
                                        onClick={navigateToAgreement}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                                    >
                                        {agreementStatus === 'loading'
                                            ? 'Загрузка...'
                                            : 'Подписать договор'}
                                    </button>
                                )}

                                {/* Кнопка оплаты (доступна только после подписания договора) */}
                                {agreementStatus === 'signed' && !isPaid && (
                                    <button
                                        onClick={handleOpenPaymentModal}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                                    >
                                        Оплатить
                                    </button>
                                )}

                                {/* Статус оплаты */}
                                {agreementStatus === 'signed' && isPaid && (
                                    <div className="flex items-center">
                                        <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Оплачено</span>
                                        </div>
                                        <button
                                            onClick={handleCancelPayment}
                                            className="ml-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm transition"
                                        >
                                            Отменить оплату
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {booking.status === 'confirmed' && (
                <div className="bg-blue-50 px-5 py-3">
                    <p className="text-sm text-blue-700">
                        {isOwner
                            ? `Бронирование подтверждено. Ожидайте гостя с ${formatDate(booking.startDate)}`
                            : `Бронирование подтверждено. Заезд ${formatDate(booking.startDate)}`
                        }
                    </p>
                </div>
            )}

            {/* Модальное окно оплаты */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Оплата бронирования</h3>
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                    disabled={isProcessingPayment}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="border rounded-lg p-4 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Сумма к оплате:</span>
                                    <span className="font-bold text-lg">{formatPrice(booking.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Объект:</span>
                                    <span className="text-gray-700">{booking.Property.title}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">ID бронирования:</span>
                                    <span className="text-gray-700">#{booking.id}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">Договор:</span>
                                    <span className="text-gray-700">#{agreement?.id || 'не создан'}</span>
                                </div>
                            </div>

                            <h4 className="font-medium text-gray-700 mb-3">Выберите способ оплаты</h4>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {/* Банковская карта */}
                                <button
                                    onClick={() => setSelectedPaymentMethod('card')}
                                    disabled={isProcessingPayment}
                                    className={`border rounded-lg p-4 flex flex-col items-center justify-center transition ${
                                        selectedPaymentMethod === 'card'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="w-10 h-10 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm">Банковская карта</span>
                                </button>

                                {/* ЮMoney */}
                                <button
                                    onClick={() => setSelectedPaymentMethod('yoomoney')}
                                    disabled={isProcessingPayment}
                                    className={`border rounded-lg p-4 flex flex-col items-center justify-center transition ${
                                        selectedPaymentMethod === 'yoomoney'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-300 hover:border-purple-300'
                                    } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="w-10 h-10 mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-purple-700">Ю</span>
                                    </div>
                                    <span className="text-sm">ЮMoney</span>
                                </button>

                                {/* СБП */}
                                <button
                                    onClick={() => setSelectedPaymentMethod('sbp')}
                                    disabled={isProcessingPayment}
                                    className={`border rounded-lg p-4 flex flex-col items-center justify-center transition ${
                                        selectedPaymentMethod === 'sbp'
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-300 hover:border-green-300'
                                    } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="w-10 h-10 mb-2 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <span className="text-sm">СБП</span>
                                </button>

                                {/* Qiwi */}
                                <button
                                    onClick={() => setSelectedPaymentMethod('qiwi')}
                                    disabled={isProcessingPayment}
                                    className={`border rounded-lg p-4 flex flex-col items-center justify-center transition ${
                                        selectedPaymentMethod === 'qiwi'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-300 hover:border-orange-300'
                                    } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="w-10 h-10 mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-orange-700">Q</span>
                                    </div>
                                    <span className="text-sm">QIWI Кошелек</span>
                                </button>
                            </div>

                            {/* Статус оплаты */}
                            {paymentStatus === 'processing' && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
                                    <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin mr-3"></div>
                                    <span className="text-blue-700">Обработка платежа...</span>
                                </div>
                            )}

                            {paymentStatus === 'success' && (
                                <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-700">Оплата прошла успешно!</span>
                                </div>
                            )}

                            {paymentStatus === 'error' && (
                                <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-red-700">
                                        {selectedPaymentMethod
                                            ? 'Ошибка оплаты. Попробуйте другой способ'
                                            : 'Выберите способ оплаты'}
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    disabled={isProcessingPayment}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 transition ${
                                        isProcessingPayment ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessingPayment}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
                                        isProcessingPayment
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {isProcessingPayment ? 'Обработка...' : 'Оплатить'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default BookingCard;