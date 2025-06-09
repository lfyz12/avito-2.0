import { makeAutoObservable } from 'mobx';
import AgreementService from '../service/AgreementService';



export default class AgreementStore {
    agreement = null;
    isLoading = false;
    error= null;

    constructor() {
        makeAutoObservable(this);
    }

    async createAgreement(bookingId) {
        this.isLoading = true;
        this.error = null;
        try {
            const res = await AgreementService.createAgreement(bookingId);
            this.agreement = res.data;
        } catch (e) {
            this.error = e.response?.data?.message || 'Ошибка при создании договора';
        } finally {
            this.isLoading = false;
        }
    }

    async fetchAgreementByBooking(bookingId) {
        this.isLoading = true;
        this.error = null;
        try {
            const res = await AgreementService.getAgreementByBooking(bookingId);
            this.agreement = res.data;
        } catch (e) {
            this.error = e.response?.data?.message || 'Ошибка при загрузке договора';
        } finally {
            this.isLoading = false;
        }
    }

    async downloadAgreement() {
        if (!this.agreement) return;

        try {
            const blob = await AgreementService.downloadAgreement(this.agreement.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.agreement.document;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Ошибка при скачивании договора', e);
        }
    }

    clear() {
        this.agreement = null;
        this.error = null;
    }
}
