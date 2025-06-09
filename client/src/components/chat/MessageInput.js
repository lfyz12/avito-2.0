import React, { useState } from 'react';
import { Input, Button, Upload, message as AntMessage } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MessageInput = ({ onSend, onFileUpload, isSelectedFile, resetFile }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(isSelectedFile);

    const handleSend = () => {
        if (selectedFile) {
            onFileUpload();
            resetFile();
            setSelectedFile(null);
            setInputValue('');
        } else if (inputValue.trim()) {
            onSend(inputValue.trim());
            setInputValue('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setInputValue(file.name);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <Button onClick={() => document.getElementById('fileInput').click()} icon={<UploadOutlined />}>
                Прикрепить
            </Button>
            <Input
                placeholder="Введите сообщение или выберите файл"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button type="primary" onClick={handleSend}>
                Отправить
            </Button>
        </div>
    );
};

export default MessageInput;
