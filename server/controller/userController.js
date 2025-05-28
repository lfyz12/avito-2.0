const { User } = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const tokenService = require('../service/tokenService'); // ты должен реализовать tokenService
const { validationResult } = require('express-validator');

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, name, role } = req.body;

            const candidate = await User.findOne({ where: { email } });
            if (candidate) return next(ApiError.badRequest('Пользователь с таким email уже существует'));

            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashPassword, name, role, avatar: null });

            const tokens = tokenService.generateTokens({ id: user.id, email: user.email, role: user.role });
            await tokenService.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 10 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                // sameSite: 'none',
                // secure: true,
            });

            return res.json({ user, tokens });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            const isPassValid = await bcrypt.compare(password, user.password);
            if (!isPassValid) return next(ApiError.badRequest('Неверный пароль'));

            const tokens = tokenService.generateTokens({ id: user.id, email: user.email, role: user.role });
            await tokenService.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 10 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                // sameSite: 'none',
                // secure: true,
            });

            return res.json({ user, tokens });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await tokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({ message: 'Вы вышли из аккаунта' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async checkAuth(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return next(ApiError.unauthorized('Токен отсутствует'));

            const userData = tokenService.validateAccessToken(token);
            if (!userData) return next(ApiError.unauthorized('Токен недействителен'));

            return res.json({ user: userData });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) return next(ApiError.unauthorized('Токен отсутствует'));

            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);

            if (!userData || !tokenFromDb) return next(ApiError.unauthorized('Токен недействителен'));

            const user = await User.findByPk(userData.id);
            const tokens = tokenService.generateTokens({ id: user.id, email: user.email, role: user.role });
            await tokenService.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 10 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                // sameSite: 'none',
                // secure: true,
            });

            return res.json({ user, tokens });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id; // предполагается, что middleware уже достал из токена
            const { name, avatar } = req.body;

            await User.update({ name, avatar }, { where: { id: userId } });
            const updatedUser = await User.findByPk(userId);

            return res.json(updatedUser);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new UserController();
