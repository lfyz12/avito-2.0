import {$authHost} from "../http/http";

export default class AgreementService {
    static async createAgreement(bookingId) {
        return $authHost.post('/api/agreement/', { bookingId });
    }

    static async getAgreementByBooking(bookingId){
        return $authHost.get(`/api/agreement/booking/${bookingId}`);
    }

    static async getAgreement(id) {
        return $authHost.get(`/api/agreement/${id}`);
    }

    static async downloadAgreement(id) {
        const response = await $authHost.get(`/api/agreement/download/${id}`, {
            responseType: 'blob',
        });
        return response.data;
    }
}
