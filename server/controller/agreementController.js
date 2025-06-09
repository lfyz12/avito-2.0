const { Agreement, Booking, Property, User } = require('../models/models');
const generateAgreementFile = require('../utils/generateAgreement');
const path = require('path');
const fs = require('fs');
class AgreementController {
    // Создание договора по бронированию
    static async create(req, res) {
        try {
            const { bookingId } = req.body;

            const booking = await Booking.findByPk(bookingId, {
                include: [{ model: User, as: 'client' }, { model: Property, include: [{ model: User, as: 'owner' }] }]
            });

            if (!booking) {
                return res.status(404).json({ message: 'Бронирование не найдено' });
            }

            const existing = await Agreement.findOne({ where: { bookingId } });
            if (existing) {
                return res.status(400).json({ message: 'Договор уже существует' });
            }

            const fileName = `agreement-${bookingId}.docx`;

            await generateAgreementFile({
                clientName: booking.client.name,
                ownerName: booking.Property.owner.name,
                propertyTitle: booking.Property.title,
                startDate: booking.startDate,
                endDate: booking.endDate,
                totalPrice: booking.totalPrice,
                fileName
            });

            const agreement = await Agreement.create({
                bookingId,
                document: fileName
            });

            res.status(201).json(agreement);

        } catch (error) {
            console.error('Agreement create error:', error);
            res.status(500).json({ message: 'Ошибка при создании договора' });
        }
    }



    static async download(req, res) {
        try {
            const { id } = req.params;
            const agreement = await Agreement.findByPk(id);
            if (!agreement) return res.status(404).json({ message: 'Договор не найден' });

            const filePath = path.join(__dirname, '../static', agreement.document);
            if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Файл не найден' });

            res.download(filePath, agreement.document);
        } catch (error) {
            console.error('Agreement download error:', error);
            res.status(500).json({ message: 'Ошибка при скачивании' });
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
