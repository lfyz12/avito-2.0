const jwt = require('jsonwebtoken')
const tokenController = require('../service/tokenService')
const ApiError = require('../Error/ApiError')


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.unauthorized())
        }
        const decoded = tokenController.validateAccessToken(token)
        if (!decoded) {
            return next(ApiError.unauthorized())
        }
        req.user = decoded
        next()
    } catch (e) {
        return next(ApiError.unauthorized())
    }
}