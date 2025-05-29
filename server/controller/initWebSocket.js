const { Server } = require("socket.io");
const { Message, Chat } = require("../models/models");
const { Op } = require("sequelize");

function initWebSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("join", async (userId) => {
            socket.userId = userId;

            const chats = await Chat.findAll({
                where: {
                    [Op.or]: [
                        { user1Id: userId },
                        { user2Id: userId }
                    ]
                },
                attributes: ['id']
            });

            for (const c of chats) {
                socket.join(c.id.toString());
            }
        });

        socket.on("send_message", async ({ toUserId, text }) => {
            if (!socket.userId || !toUserId || !text) return;

            let chat = await Chat.findOne({
                where: {
                    [Op.or]: [
                        { user1Id: socket.userId, user2Id: toUserId },
                        { user1Id: toUserId, user2Id: socket.userId }
                    ]
                }
            });

            if (!chat) {
                chat = await Chat.create({
                    user1Id: socket.userId,
                    user2Id: toUserId,
                });
                socket.join(chat.id.toString());
            }

            const message = await Message.create({
                fromUserId: socket.userId,
                toUserId,
                text,
                chatId: chat.id,
            });

            io.to(chat.id.toString()).emit("new_message", {
                fromUserId: socket.userId,
                text,
                timestamp: message.timestamp,
                chatId: chat.id,
            });

            socket.emit("message_sent", {
                toUserId,
                text,
                chatId: chat.id,
                timestamp: message.timestamp,
            });
        });

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });
}

module.exports = initWebSocket;
