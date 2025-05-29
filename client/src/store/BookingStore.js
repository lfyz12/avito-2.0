// stores/BookingStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import BookingService from "../service/BookingService";

export default class BookingStore {
    bookings = [];
    myBookings = [];
    ownerBookings = [];
    selectedBooking = null;
    loading = false;
    error = null;
    tempBooking = {};
    currentBookings = [];

    constructor() {
        makeAutoObservable(this);
    }

    // Получить все бронирования (для админки)
    async fetchAllBookings() {
        this.loading = true;
        try {
            const { data } = await BookingService.getAll();
            runInAction(() => {
                this.bookings = data;
                this.error = null;
            });
        } catch (err) {
            runInAction(() => this.error = err.response?.data?.message || "Ошибка при загрузке бронирований");
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Получить бронирования текущего пользователя
    async fetchMyBookings() {
        this.loading = true;
        try {
            const { data } = await BookingService.getMyBookings();
            runInAction(() => {
                this.myBookings = data;
                this.error = null;
            });
        } catch (err) {
            runInAction(() => this.error = err.response?.data?.message || "Ошибка при загрузке моих бронирований");
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Получить бронирования на мои объекты
    async fetchBookingsForMyProperties() {
        this.loading = true;
        try {
            const { data } = await BookingService.getBookingsForMyProperties();
            runInAction(() => {
                this.ownerBookings = data;
                this.error = null;
            });
        } catch (err) {
            runInAction(() => this.error = err.response?.data?.message || "Ошибка при загрузке бронирований на мои объекты");
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Получить одно бронирование
    async fetchBookingById(id) {
        this.loading = true;
        try {
            const { data } = await BookingService.getById(id);
            runInAction(() => {
                this.selectedBooking = data;
                this.error = null;
            });
        } catch (err) {
            runInAction(() => this.error = err.response?.data?.message || "Ошибка при получении бронирования");
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Создать бронирование
    async createBooking(propertyId, startDate, endDate, totalPrice) {
        this.loading = true;
        try {
            // Оптимистичное обновление
            this.tempBooking = {
                id: Date.now(), // Временный ID
                propertyId,
                startDate,
                endDate,
                totalPrice,
                status: 'pending',
                createdAt: new Date().toISOString(),
                isTemp: true // Флаг временного объекта
            };

            runInAction(() => {
                this.myBookings.push(this.tempBooking);
                this.error = null;
            });

            // Отправка на сервер
            const { data } = await BookingService.create(
                propertyId,
                startDate,
                endDate,
                totalPrice
            );

            // Замена временного объекта на реальный
            runInAction(() => {
                this.myBookings = this.myBookings.map(b =>
                    b.id === this.tempBooking.id ? data : b
                );
            });

            return data;
        } catch (err) {
            runInAction(() => {
                this.error = err.response?.data?.message || "Ошибка при создании бронирования";
                // Удаление временного объекта при ошибке
                this.myBookings = this.myBookings.filter(b => b.id !== this.tempBooking.id);
            });
            throw err;
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Обновить статус бронирования
    async updateBookingStatus(id, status) {
        this.loading = true;
        try {
            // Сохраняем текущее состояние для возможного отката
            this.currentBookings = [...this.ownerBookings];

            // Оптимистичное обновление
            runInAction(() => {
                const index = this.ownerBookings.findIndex(b => b.id === id);
                if (index !== -1) {
                    this.ownerBookings[index].status = status;
                }
            });

            // Отправка на сервер
            const { data } = await BookingService.updateStatus(id, status);

            // Обновляем данными с сервера
            runInAction(() => {
                const index = this.ownerBookings.findIndex(b => b.id === id);
                if (index !== -1) {
                    this.ownerBookings[index] = data;
                }
            });

            return data;
        } catch (err) {
            runInAction(() => {
                this.error = err.response?.data?.message || "Ошибка при обновлении статуса";
                // Возвращаем предыдущее состояние
                this.ownerBookings = this.currentBookings;
            });
            throw err;
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Удалить бронирование
    async deleteBooking(id) {
        this.loading = true;
        try {
            await BookingService.delete(id);
            runInAction(() => {
                this.myBookings = this.myBookings.filter(b => b.id !== id);
                this.bookings = this.bookings.filter(b => b.id !== id);
                this.error = null;
            });
        } catch (err) {
            runInAction(() => this.error = err.response?.data?.message || "Ошибка при удалении бронирования");
            throw err;
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Очистить выбор
    clearSelected() {
        this.selectedBooking = null;
    }

    // Очистить ошибки
    clearError() {
        this.error = null;
    }
}

