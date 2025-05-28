const { Agreement, Booking } = require('../models/models');

class AgreementController {
    // Создание договора по бронированию
    static async create(req, res) {
        try {
            const { bookingId, document } = req.body;

            // Проверка, существует ли такая бронь
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Бронирование не найдено' });
            }

            // Проверка, что договор ещё не создан
            const existing = await Agreement.findOne({ where: { bookingId } });
            if (existing) {
                return res.status(400).json({ message: 'Договор уже существует для этого бронирования' });
            }

            const agreement = await Agreement.create({ bookingId, document });
            res.status(201).json(agreement);
        } catch (error) {
            console.error('Agreement create error:', error);
            res.status(500).json({ message: 'Ошибка при создании договора' });
        }
    }

    // Получить договор по ID
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const agreement = await Agreement.findByPk(id, {
                include: [{ model: Booking }]
            });

            if (!agreement) {
                return res.status(404).json({ message: 'Договор не найден' });
            }

            res.json(agreement);
        } catch (error) {
            console.error('Agreement getOne error:', error);
            res.status(500).json({ message: 'Ошибка при получении договора' });
        }
    }

    // Получить договор по ID бронирования
    static async getByBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const agreement = await Agreement.findOne({
                where: { bookingId },
                include: [{ model: Booking }],
            });

            if (!agreement) {
                return res.status(404).json({ message: 'Договор не найден для этого бронирования' });
            }

            res.json(agreement);
        } catch (error) {
            console.error('Agreement getByBooking error:', error);
            res.status(500).json({ message: 'Ошибка при получении договора' });
        }
    }

    // Удаление договора (опционально)
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const agreement = await Agreement.findByPk(id);
            if (!agreement) {
                return res.status(404).json({ message: 'Договор не найден' });
            }

            await agreement.destroy();
            res.json({ message: 'Договор удалён' });
        } catch (error) {
            console.error('Agreement delete error:', error);
            res.status(500).json({ message: 'Ошибка при удалении договора' });
        }
    }
}

module.exports = AgreementController;
