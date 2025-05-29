import { makeAutoObservable, runInAction } from "mobx";
import ReviewService from "../service/ReviewService";

export default class ReviewStore {
    reviews = [];
    myReviews = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Получение отзывов для конкретного объекта
    async fetchReviewsForProperty(propertyId) {
        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await ReviewService.getForProperty(propertyId);
            runInAction(() => {
                this.reviews = data;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err?.response?.data?.message || "Ошибка при загрузке отзывов";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // Получение всех отзывов пользователя
    async fetchMyReviews() {
        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await ReviewService.getMyReviews();
            runInAction(() => {
                this.myReviews = data;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err?.response?.data?.message || "Ошибка при загрузке ваших отзывов";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // Создание отзыва
    async createReview({ propertyId, rating, text }) {
        this.isLoading = true;
        this.error = null;
        try {
            const { data } = await ReviewService.create({ propertyId, rating, text });
            runInAction(() => {
                this.reviews.push(data);
                this.myReviews.push(data);
            });
            return data;
        } catch (err) {
            runInAction(() => {
                this.error = err?.response?.data?.message || "Ошибка при создании отзыва";
            });
            throw err;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // Удаление отзыва
    async deleteReview(id) {
        this.isLoading = true;
        this.error = null;
        try {
            await ReviewService.delete(id);
            runInAction(() => {
                this.reviews = this.reviews.filter((r) => r.id !== id);
                this.myReviews = this.myReviews.filter((r) => r.id !== id);
            });
        } catch (err) {
            runInAction(() => {
                this.error = err?.response?.data?.message || "Ошибка при удалении отзыва";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    clear() {
        this.reviews = [];
        this.myReviews = [];
        this.error = null;
        this.isLoading = false;
    }
}

