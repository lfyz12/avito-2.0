import { observer } from "mobx-react-lite";
import {useContext, useState} from "react";
import {Context} from "../index";

const ChatWindow = observer(() => {
    const [text, setText] = useState("");
    const {chatStore} = useContext(Context)

    const send = () => {
        if (text.trim()) {
            chatStore.sendMessage(text);
            setText("");
        }
    };

    return (
        <div className="border-t pt-2 mt-2">
            <div className="max-h-64 overflow-y-auto">
                {chatStore.messages.map((msg, idx) => (
                    <div key={idx} className="mb-1">
                        <b>{msg.fromUserId === chatStore.userId ? "Вы" : "Собеседник"}:</b> {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex mt-2 gap-2">
                <input
                    type="text"
                    className="border p-1 flex-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button onClick={send} className="bg-blue-500 text-white px-3 py-1 rounded">
                    Отправить
                </button>
            </div>
        </div>
    );
});

export default ChatWindow;
