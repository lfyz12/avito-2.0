const express = require('express');
const router = express.Router();
const { Chat, Message, User } = require('../models/models');
const { Op } = require("sequelize");

// Получить все чаты пользователя
router.get('/:userId', async (req, res) => {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ error: 'Invalid userId' });

    const chats = await Chat.findAll({
        where: {
            [Op.or]: [{ user1Id: userId }, { user2Id: userId }]
        },
        include: [
            { model: User, as: 'user1', attributes: ['id', 'name'] },
            { model: User, as: 'user2', attributes: ['id', 'name'] },
        ]
    });

    res.json(chats);
});

// Получить сообщения чата
router.get('/:chatId/messages', async (req, res) => {
    const chatId = Number(req.params.chatId);
    if (!chatId) return res.status(400).json({ error: 'Invalid chatId' });

    const messages = await Message.findAll({
        where: { chatId },
        order: [['timestamp', 'ASC']],
        include: [
            { model: User, as: 'sender', attributes: ['id', 'name'] },
            { model: User, as: 'receiver', attributes: ['id', 'name'] },
        ]
    });

    res.json(messages);
});

// Получить или создать чат
router.post('/get-or-create', async (req, res) => {
    const { user1Id, user2Id } = req.body;
    if (!user1Id || !user2Id) return res.status(400).json({ error: 'user1Id and user2Id required' });

    let chat = await Chat.findOne({
        where: {
            [Op.or]: [
                { user1Id, user2Id },
                { user1Id: user2Id, user2Id: user1Id }
            ]
        }
    });

    if (!chat) {
        chat = await Chat.create({ user1Id, user2Id });
    }

    res.json(chat);
});

module.exports = router;
