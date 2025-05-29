import { io } from "socket.io-client";
import { $authHost } from "../http/http";

class ChatService {
    socket = null;

    connect(userId) {
        this.socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");
        this.socket.emit("join", userId);
    }

    sendMessage(toUserId, text) {
        this.socket?.emit("send_message", { toUserId, text });
    }

    onNewMessage(callback) {
        this.socket?.on("new_message", callback);
    }

    onMessageSent(callback) {
        this.socket?.on("message_sent", callback);
    }

    disconnect() {
        this.socket?.disconnect();
    }

    async getOrCreateChat(user1Id, user2Id) {
        const res = await $authHost.post("/api/chat/get-or-create", { user1Id, user2Id });
        return res.data;
    }

    async fetchMessages(chatId) {
        const res = await $authHost.get(`/api/chat/${chatId}/messages`);
        return res.data;
    }

    async fetchUserChats(userId) {
        const res = await $authHost.get(`/api/chat/${userId}`);
        return res.data;
    }
}

export default new ChatService();