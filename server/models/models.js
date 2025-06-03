const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'client',
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: DataTypes.STRING,
    avatar: {type: DataTypes.STRING, allowNull: true},
})

const Token = sequelize.define('Token', {
    TokenID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserID: { type: DataTypes.INTEGER, allowNull: false }, // Привязка к пользователю
    RefreshToken: { type: DataTypes.TEXT, allowNull: false }, // Сохранение refresh-токена
});

User.hasMany(Token, { foreignKey: 'UserID' });
Token.belongsTo(User, { foreignKey: 'UserID' });

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    price: DataTypes.FLOAT,
    type: {type: DataTypes.STRING, defaultValue: 'apartment'},
    rooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    area: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amenities: DataTypes.ARRAY(DataTypes.STRING),
    photos: DataTypes.ARRAY(DataTypes.STRING),
})

const Like = sequelize.define('Like', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
})

const LikeProperties = sequelize.define('LikeProperties', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
})

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'new',
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    totalPrice: DataTypes.FLOAT,
})

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
    },
    text: DataTypes.TEXT,
});


const Agreement = sequelize.define('Agreement', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    document: DataTypes.TEXT,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    updatedAt: false, // договор не редактируется
});

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    textOrPathToFile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    messageType: {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    updatedAt: false,
});




Chat.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
Chat.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });

// Один чат — много сообщений
Chat.hasMany(Message, { foreignKey: 'chatId', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

// Сообщение отправлено одним пользователем
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });


// Property — владелец
User.hasMany(Property, { foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Like.hasMany(LikeProperties, { foreignKey: 'likeId' });
LikeProperties.belongsTo(Like, { as: 'like', foreignKey: 'likeId' });

Property.hasMany(LikeProperties, { foreignKey: 'propertyId' });
LikeProperties.belongsTo(Property, {as: 'property', foreignKey: 'propertyId' });
// Booking — клиент и объект
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { as: 'client', foreignKey: 'userId' });

Property.hasMany(Booking, { foreignKey: 'propertyId' });
Booking.belongsTo(Property, { foreignKey: 'propertyId' });

// Agreement — договор на основе брони
Booking.hasOne(Agreement, { foreignKey: 'bookingId' });
Agreement.belongsTo(Booking, { foreignKey: 'bookingId' });

// Review — кто и на что
User.hasMany(Review, { foreignKey: 'authorId' });
Review.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

Property.hasMany(Review, { foreignKey: 'propertyId' });
Review.belongsTo(Property, { foreignKey: 'propertyId' });

Chat.belongsTo(Property, { foreignKey: 'propertyId' });
Property.hasMany(Chat, { foreignKey: 'propertyId' });

module.exports = {
    User, Property, Token, Review, Message, Booking, Agreement, Like, LikeProperties, Chat
}