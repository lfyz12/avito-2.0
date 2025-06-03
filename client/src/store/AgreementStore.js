import { makeAutoObservable } from "mobx";
import AgreementService from "../service/AgreementService";

export default class AgreementStore {
    agreement = null; // текущий договор
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Получить договор по ID бронирования
    async fetchByBooking(bookingId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await AgreementService.getByBooking(bookingId);
            this.agreement = response.data;
        } catch (err) {
            this.error = err.response?.data?.message || "Ошибка при загрузке договора";
            this.agreement = null;
        } finally {
            this.isLoading = false;
        }
    }

    // Получить договор по ID
    async fetchById(id) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await AgreementService.getOne(id);
            this.agreement = response.data;
        } catch (err) {
            this.error = err.response?.data?.message || "Ошибка при загрузке договора";
            this.agreement = null;
        } finally {
            this.isLoading = false;
        }
    }

    // Создать договор
    async createAgreement(bookingId, document) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await AgreementService.create({ bookingId, document });
            this.agreement = response.data;
        } catch (err) {
            this.error = err.response?.data?.message || "Ошибка при создании договора";
        } finally {
            this.isLoading = false;
        }
    }

    // Очистить данные
    clear() {
        this.agreement = null;
        this.error = null;
        this.isLoading = false;
    }
}

