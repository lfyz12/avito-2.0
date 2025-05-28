// // ws.js
// const { Server } = require("socket.io");
// const { Message, User } = require("./models");
//
// function initWebSocket(server) {
//     const io = new Server(server, {
//         cors: { origin: "*" }
//     });
//
//     io.on("connection", (socket) => {
//         console.log("🟢 User connected:", socket.id);
//
//         // Привязываем пользователя по ID
//         socket.on("join", (userId) => {
//             socket.userId = userId;
//             socket.join(userId); // Подключаем в "комнату" с его ID
//         });
//
//         // Обработка нового сообщения
//         socket.on("send_message", async ({ toUserId, text }) => {
//             if (!socket.userId || !toUserId || !text) return;
//
//             const message = await Message.create({
//                 fromUserId: socket.userId,
//                 toUserId,
//                 text,
//             });
//
//             // Отправка получателю
//             io.to(toUserId).emit("new_message", {
//                 fromUserId: socket.userId,
//                 text,
//                 timestamp: message.timestamp,
//             });
//
//             // (опционально) подтверждение отправителю
//             socket.emit("message_sent", { toUserId, text });
//         });
//
//         socket.on("disconnect", () => {
//             console.log("🔴 User disconnected:", socket.id);
//         });
//     });
// }
//
// module.exports = initWebSocket;
