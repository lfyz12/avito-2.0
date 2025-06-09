const { Chat, Message, User, Property} = require('../models/models');
const {Op} = require("sequelize");
const ApiError = require('../error/ApiError');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
class ChatController {
    // Создание бронирования пользователем
    async createChat(req, res, next) {
        try {
            const { user1Id, user2Id, propertyId } = req.body;

            // Проверка, есть ли уже чат по этим трем параметрам
            const existingChat = await Chat.findOne({
                where: {
                    [Op.or]: [
                        { user1Id, user2Id, propertyId },
                        { user1Id: user2Id, user2Id: user1Id, propertyId }
                    ]
                }
            });

            if (existingChat) {
                return res.status(200).json(existingChat);
            }

            const chat = await Chat.create({ user1Id, user2Id, propertyId });
            res.status(201).json(chat);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async getChatUsers(req, res, next) {
        try {
            const userId = req.params.userId;
            const chats = await Chat.findAll({
                where: {
                    [Op.or]: [
                        { user1Id: userId },
                        { user2Id: userId }
                    ]
                },
                include: [
                    { model: User, as: 'user1' },
                    { model: User, as: 'user2' },
                    {
                        model: Message,
                        order: [['createdAt', 'DESC']],
                        limit: 1
                    },
                    {
                        model: Property
                    }
                ]
            });
            res.json(chats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async getChatMessages(req, res, next){
        try {
            const chatId = req.params.chatId;
            const messages = await Message.findAll({
                where: { chatId },
                include: [{ model: User, as: 'sender' }],
                order: [['createdAt', 'ASC']]
            });
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async getChatById(req, res, next){
        try {
            const chatId = req.params.chatId;
            const chat = await Chat.findOne({
                where: { id: chatId },
                include: [
                    { model: User, as: 'user1' },
                    { model: User, as: 'user2' },
                    {
                        model: Property
                    }
                ]
            });
            res.json(chat);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async uploadFile(req, res, next) {
        try {
            const { chatId, senderId } = req.body;
            const file = req.file;

            if (!file) {
                return next(ApiError.badRequest('Файл не был предоставлен'));
            }

            // Сохраняем сообщение в БД
            const message = await Message.create({
                chatId,
                senderId,
                textOrPathToFile: file.filename,
                messageType: 'file',
            });

            // Получаем отправителя
            const sender = await User.findByPk(senderId, {
                attributes: ['id', 'name', 'avatar']
            });

            // Отправляем сообщение через WebSocket
            req.app.get('wss').clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: 'newMessage',
                        message: {
                            ...message.toJSON(),
                            sender
                        }
                    }));
                }
            });

            return res.json(message);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }


    async getFile(req, res, next) {
        try {
            const { filename } = req.params;
            const filePath = path.resolve(__dirname, '..', 'static', 'chat', filename);

            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }
            return next(ApiError.badRequest('File not found'));
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

}

module.exports = new ChatController();