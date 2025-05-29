import { makeAutoObservable, runInAction } from 'mobx';
import UserService from '../service/UserService';

export default class UserStore {
    _user = null;
    _isAuth = false;
    _error = null;
    _isLoading = false;
    _users = [];
    pickUserId = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Сеттеры
    setUser(user) {
        this._user = user;
    }

    setUsers(users) {
        this._users = users;
    }

    setAuth(isAuth) {
        this._isAuth = isAuth;
    }

    setError(error) {
        this._error = error;
    }

    setLoading(isLoading) {
        this._isLoading = isLoading;
    }

    setPickUserId(id) {
        this.pickUserId = id;
    }

    // Геттеры
    get user() {
        return this._user;
    }

    get users() {
        return this._users;
    }

    get isAuth() {
        return this._isAuth;
    }

    get error() {
        return this._error;
    }

    get isLoading() {
        return this._isLoading;
    }

    // Методы работы с API
    async registration(email, password, name, role, phone) {
        this.setLoading(true);
        this.setError(null);
        try {
            const data = await UserService.registration(email, password, name, role, phone);
            localStorage.setItem('accessToken', data.tokens.accessToken);
            runInAction(() => {
                this.setUser(data.user);
                this.setAuth(true);
            });
            return data;
        } catch (error) {
            this.setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async login(email, password) {
        this.setLoading(true);
        this.setError(null);
        try {
            const data = await UserService.login(email, password);
            localStorage.setItem('accessToken', data.tokens.accessToken);
            runInAction(() => {
                this.setUser(data.user);
                this.setAuth(true);
            });
            return data;
        } catch (error) {
            this.setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async refresh() {
        this.setLoading(true);
        try {
            const data = await UserService.refresh();
            localStorage.setItem('accessToken', data.tokens.accessToken);
            runInAction(() => {
                this.setUser(data.user);
                this.setAuth(true);
            });
            return data;
        } catch (error) {
            // Ошибка при обновлении токена - не критичная
            console.warn('Ошибка при обновлении токена:', error);
            // Очищаем состояние аутентификации
            runInAction(() => {
                this.setUser(null);
                this.setAuth(false);
            });
            // Удаляем токен на всякий случай
            localStorage.removeItem('accessToken');
            // Не устанавливаем ошибку в состояние, чтобы не показывать пользователю
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        this.setLoading(true);
        try {
            await UserService.logout();
        } catch (error) {
            // Ошибка при выходе - не критичная
            console.warn('Ошибка при выходе:', error);
        } finally {
            // Всегда очищаем состояние
            localStorage.removeItem('accessToken');
            runInAction(() => {
                this.setUser(null);
                this.setAuth(false);
                this.setError(null); // Очищаем предыдущие ошибки
            });
            this.setLoading(false);
        }
    }

    // ... остальные методы ...


    async updateProfile(userData) {
        this.setLoading(true);
        this.setError(null);
        try {
            const data = await UserService.updateProfile(userData);
            runInAction(() => {
                this.setUser(data);
            });
            return data;
        } catch (error) {
            this.setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async getAllUsers() {
        this.setLoading(true);
        this.setError(null);
        try {
            const data = await UserService.getAllUsers();
            runInAction(() => {
                this.setUsers(data);
            });
            return data;
        } catch (error) {
            this.setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
}

