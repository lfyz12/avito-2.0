import { makeAutoObservable, runInAction } from "mobx";
import ChatService from "../service/ChatService";

export default class ChatStore {
    chats = [];
    messages = [];
    currentChatUserId = null;
    currentChatUser = null;
    userId = "";

    constructor() {
        makeAutoObservable(this);
    }

    setUser(userId) {
        this.userId = userId;
        ChatService.connect(userId);

        ChatService.onNewMessage((msg) => {
            this.messages.push(msg);
            this.updateChatLastMessage(msg.chatId, msg.text, msg.timestamp);
        });

        ChatService.onMessageSent((msg) => {
            this.messages.push({
                ...msg,
                fromUserId: this.userId,
                timestamp: new Date().toISOString(),
            });
            this.updateChatLastMessage(msg.chatId, msg.text, msg.timestamp);
        });
    }

    updateChatLastMessage(chatId, text, timestamp) {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            chat.lastMessage = { text, timestamp };
        }
    }

    async fetchChats() {
        try {
            const res = await ChatService.fetchUserChats(this.userId);
            runInAction(() => {
                this.chats = res;
            });
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    }

    async startChat(toUserId) {
        this.currentChatUserId = toUserId;
        const chat = await ChatService.getOrCreateChat(this.userId, toUserId);
        const history = await ChatService.fetchMessages(chat.id);

        runInAction(() => {
            const otherUser = chat.user1.id === this.userId ? chat.user2 : chat.user1;
            this.currentChatUser = otherUser;
            this.messages = history;
        });

        await this.fetchChats();
    }

    async selectChat(chat) {
        this.currentChatUserId = chat.id;
        const otherUserId = chat.user1.id === this.userId ? chat.user2.id : chat.user1.id;

        const history = await ChatService.fetchMessages(chat.id);

        runInAction(() => {
            this.currentChatUser = chat.user1.id === this.userId ? chat.user2 : chat.user1;
            this.messages = history;
        });
    }

    sendMessage(text) {
        if (this.currentChatUserId) {
            ChatService.sendMessage(this.currentChatUserId, text);
        }
    }

    disconnect() {
        ChatService.disconnect();
    }
}

