const { Chat, Message, User } = require('../models/models')

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id)

        // Вход в чат по chatId (для комнат)
        socket.on('join_chat', (chatId) => {
            socket.join(`chat_${chatId}`)
        })

        // Отправка сообщения
        socket.on('send_message', async ({ chatId, senderId, text }) => {
            try {
                const message = await Message.create({
                    chatId,
                    senderId,
                    text
                })

                const fullMessage = await Message.findByPk(message.id, {
                    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }]
                })

                io.to(`chat_${chatId}`).emit('receive_message', fullMessage)
            } catch (err) {
                console.error('Send message error:', err)
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })
    })
}
