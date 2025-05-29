// stores/LikeStore.js
import { makeAutoObservable, runInAction } from 'mobx';
import LikeService from '../service/LikeService';

export default class LikeStore {
    likedProperties = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchLikedProperties() {
        this.loading = true;
        this.error = null;
        try {
            const data = await LikeService.getLikedProperties();
            runInAction(() => {
                this.likedProperties = data;
                this.loading = false;
            });
        } catch (e) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Ошибка при загрузке избранного';
                this.loading = false;
            });
        }
    }

    async addToLiked(propertyId) {
        this.error = null;
        try {
            // Оптимистичное обновление
            runInAction(() => {
                if (!this.likedProperties.some(p => p.id === propertyId)) {
                    this.likedProperties.push({
                        id: propertyId,
                        // Добавьте минимально необходимые поля
                        title: '',
                        price: 0,
                        location: '',
                        photos: []
                    });
                }
            });

            await LikeService.add(propertyId);
            await this.fetchLikedProperties()
        } catch (e) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Ошибка при добавлении в избранное';
                // Откатываем изменения при ошибке
                this.likedProperties = this.likedProperties.filter(p => p.id !== propertyId);
            });
        }
    }

    async removeFromLiked(propertyId) {
        this.error = null;
        try {
            // Сохраняем копию для отката
            const backup = [...this.likedProperties];

            // Оптимистичное обновление
            runInAction(() => {
                this.likedProperties = this.likedProperties.filter(p => p.id !== propertyId);
            });

            await LikeService.remove(propertyId);
            await this.fetchLikedProperties()
        } catch (e) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Ошибка при удалении из избранного';
                // Восстанавливаем данные при ошибке
            });
        }
    }

    isLiked(propertyId) {
        return this.likedProperties.some((p) => p.id === propertyId);
    }
}