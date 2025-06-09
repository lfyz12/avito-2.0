const WebSocket = require('ws');
const { Message, Chat, User } = require('../models/models');

const initWebSocket = (server, app) => {
    const wss = new WebSocket.Server({ server });

    app.set('wss', wss);
    wss.on('connection', (ws) => {
        ws.on('message', async (data) => {
            try {
                const { chatId, senderId, content, type } = JSON.parse(data);

                // Сохраняем в БД
                const newMessage = await Message.create({
                    chatId,
                    senderId,
                    textOrPathToFile: content,
                    messageType: type || 'text',
                });

                // Получаем данные отправителя
                const sender = await User.findByPk(senderId, {
                    attributes: ['id', 'name', 'avatar']
                });

                // Рассылка всем участникам чата
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'newMessage',
                            message: {
                                ...newMessage.toJSON(),
                                sender
                            }
                        }));
                    }
                });

            } catch (e) {
                console.error('WS Error:', e);
            }
        });
    });

    console.log('WebSocket Server started');
    return wss;
};

module.exports = initWebSocket;