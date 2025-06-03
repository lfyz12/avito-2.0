require('dotenv').config() //Подключение к окружению
const express = require('express') //Подключение фреймворка
const sequelize = require('./db')  //Подключение к бд
const models = require('./models/models') //Инициализация бд
const cors = require('cors') //Импорт cors
const router = require('./routers/index')
const PORT = process.env.PORT || 5000 //Инициализация порта
const app = express() //Объект приложения
const errorHandler = require('./middlewares/errorMiddleware') //Инициализация еррорхендлера
const path = require('path')
const cookieParser = require('cookie-parser')
const {Server} = require("socket.io");
const initWebSocket = require("./controller/initWebSocket");
const corsOptions ={
    origin: 'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json())  //Это чтобы приложение могло парсить json формат
app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use('/static/chat', express.static(path.resolve(__dirname, 'static', 'chat')));

app.use('/api', router)



//Обработка ошибок, последний Middleware
//!!!РЕГИСТРИРУЕТСЯ ОБЯЗАТЕЛЬНО В САМОМ КОНЦЕ!!!
app.use(errorHandler)

const server = require('http').createServer(app)

initWebSocket(server);
// const io = require('socket.io')(server, {
//     cors: {
//         origin: "http://localhost:3000"
//     },
//     path: "/webSocket/"
// })

// const io = new Server(server, {
//     cors: { origin: '*' },
// });
//
// io.on('connection', socket => {
//     console.log('Пользователь подключился:', socket.id);
//
//     socket.on('join', ({ chatId }) => {
//         socket.join(`chat_${chatId}`);
//     });
//
//     socket.on('sendMessage', async ({ chatId, senderId, text }) => {
//         const message = await Message.create({ chatId, senderId, text });
//         io.to(`chat_${chatId}`).emit('newMessage', { message });
//     });
//
//     socket.on('disconnect', () => {
//         console.log('Пользователь отключился:', socket.id);
//     });
// });


//Запуск сервера
const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()