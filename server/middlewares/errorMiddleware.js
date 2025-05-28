module.exports = function (err, req, res, next) {
    console.error(err.stack); // Логгирование ошибки
    return res.status(err.status || 500).json({
        message: err.message || 'Внутренняя ошибка сервера',
        errors: err.errors || [],
    });
};