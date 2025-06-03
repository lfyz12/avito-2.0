// MessageInput.jsx
import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { PaperClipOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';

const MessageInput = ({ onSend, onFileUpload }) => {
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex items-center p-3 border-t border-gray-200 bg-white">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={onFileUpload}
            />

            <button
                type="button"
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                onClick={handleFileClick}
            >
                <PaperClipOutlined className="text-xl" />
            </button>


            <div className="flex-grow ml-2 bg-gray-100 rounded-2xl px-3 py-2">
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="w-full bg-transparent border-0 focus:outline-none resize-none max-h-32"
                    rows={1}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
            </div>

            <button
                type="button"
                className={`ml-2 p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                    message.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'text-gray-400 cursor-not-allowed'
                } transition-colors`}
                onClick={handleSubmit}
                disabled={!message.trim()}
            >
                <SendOutlined className="text-lg" />
            </button>
        </div>
    );
};

export default MessageInput;