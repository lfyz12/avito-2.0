import { makeAutoObservable } from "mobx";
import PropertyService from "../service/PropertyService";

export default class PropertyStore {
    _properties = []; // Все объекты
    _myProperties = []; // Объекты текущего пользователя
    _selectedProperty = null; // Выбранный объект
    _isLoading = false;
    _error = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Сеттеры
    setProperties(properties) {
        this._properties = properties;
    }

    setMyProperties(properties) {
        this._myProperties = properties;
    }

    setSelectedProperty(property) {
        this._selectedProperty = property;
    }

    setLoading(isLoading) {
        this._isLoading = isLoading;
    }

    setError(error) {
        this._error = error;
    }

    // Геттеры
    get properties() {
        return this._properties;
    }

    get myProperties() {
        return this._myProperties;
    }

    get selectedProperty() {
        return this._selectedProperty;
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    // Методы
    async fetchAll() {
        this.setLoading(true);
        try {
            const { data } = await PropertyService.getAll();
            this.setProperties(data);
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при загрузке объектов");
        } finally {
            this.setLoading(false);
        }
    }

    async fetchMy() {
        this.setLoading(true);
        try {
            const { data } = await PropertyService.getMyProperties();
            this.setMyProperties(data);
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при загрузке ваших объектов");
        } finally {
            this.setLoading(false);
        }
    }

    async fetchById(id) {
        this.setLoading(true);
        try {
            const { data } = await PropertyService.getById(id);
            this.setSelectedProperty(data);
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при получении объекта");
        } finally {
            this.setLoading(false);
        }
    }

    async create(propertyData) {
        this.setLoading(true);
        try {
            const { data } = await PropertyService.create(propertyData);
            this._myProperties.push(data);
            return data;
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при создании объекта");
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    async update(id, propertyData) {
        this.setLoading(true);
        try {
            const { data } = await PropertyService.update(id, propertyData);
            this._myProperties = this._myProperties.map(p => (p.id === id ? data : p));
            if (this._selectedProperty?.id === id) this.setSelectedProperty(data);
            return data;
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при обновлении объекта");
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    async delete(id) {
        this.setLoading(true);
        try {
            await PropertyService.delete(id);
            this._myProperties = this._myProperties.filter(p => p.id !== id);
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при удалении объекта");
            throw e;
        } finally {
            this.setLoading(false);
        }
    }
}

