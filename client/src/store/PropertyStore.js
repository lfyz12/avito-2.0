import { makeAutoObservable, runInAction } from "mobx";
import PropertyService from "../service/PropertyService";

export default class PropertyStore {
    _properties = [];
    _popularProperties = [];
    _myProperties = [];
    _selectedProperty = null;
    _isLoading = false;
    _error = null;
    _pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12,
    };
    _filters = {
        minPrice: null,
        maxPrice: null,
        type: null,
        rooms: null,
        location: '',
        amenities: [],
    };
    _sort = {
        by: 'createdAt',
        order: 'DESC',
    };

    constructor() {
        makeAutoObservable(this);
    }

    // Сеттеры
    setProperties(properties) {
        this._properties = properties;
    }

    setPopProperties(properties) {
        this._popularProperties = properties;
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

    setPagination(pagination) {
        this._pagination = {
            ...this._pagination,
            ...pagination
        };
    }

    setFilters(filters) {
        this._filters = {
            ...this._filters,
            ...filters
        };
    }

    setSort(sort) {
        this._sort = {
            ...this._sort,
            ...sort
        };
    }

    setPage(page) {
        this.setPagination({ currentPage: page });
    }

    setItemsPerPage(itemsPerPage) {
        this.setPagination({
            itemsPerPage,
            currentPage: 1 // Сброс на первую страницу при изменении размера
        });
    }

    // Геттеры
    get properties() {
        return this._properties;
    }

    get myProperties() {
        return this._myProperties;
    }

    get popProperties() {
        return this._popularProperties;
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

    get pagination() {
        return this._pagination;
    }

    get filters() {
        return this._filters;
    }

    get sort() {
        return this._sort;
    }

    // Методы
    async fetchProperties() {
        this.setLoading(true);
        try {
            const { currentPage, itemsPerPage } = this._pagination;
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...this._filters,
                sortBy: this._sort.by,
                sortOrder: this._sort.order,
            };

            // Очищаем пустые параметры
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
                    delete params[key];
                }
            });

            const response = await PropertyService.getAll(params);
            runInAction(() => {
                this.setProperties(response.data.properties);

                this.setPagination({
                    totalPages: response.data.pagination.totalPages,
                    totalItems: response.data.pagination.totalItems,
                });
            });
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при загрузке объектов");
        } finally {
            this.setLoading(false);
        }
    }

    async fetchMy() {
        this.setLoading(true);
        try {
            const response = await PropertyService.getMyProperties();
            this.setMyProperties(response.data);
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
            runInAction(() => {
                this._myProperties.push(data);
            });
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
            runInAction(() => {
                this._myProperties = this._myProperties.map(p => (p.id === id ? data : p));
                if (this._selectedProperty?.id === id) this.setSelectedProperty(data);
            });
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
            runInAction(() => {
                this._myProperties = this._myProperties.filter(p => p.id !== id);
            });
        } catch (e) {
            this.setError(e.response?.data?.message || "Ошибка при удалении объекта");
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    // Методы для управления состоянием
    applyFilters(newFilters) {
        this.setFilters(newFilters);
        this.setPagination({ currentPage: 1 }); // Сброс на первую страницу при изменении фильтров
        this.fetchProperties();
    }

    applySort(newSort) {
        this.setSort(newSort);
        this.fetchProperties();
    }

    changePage(page) {
        this.setPage(page);
        this.fetchProperties();
    }

    changeItemsPerPage(itemsPerPage) {
        this.setItemsPerPage(itemsPerPage);
        this.fetchProperties();
    }
}