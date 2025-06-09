// === ContractGenerator.jsx ===
import { useEffect, useState } from 'react';
import axios from 'axios';
import {$authHost} from "../http/http";

export default function ContractGenerator() {
    const [template, setTemplate] = useState('');
    const [data, setData] = useState({
        landlordName: '',
        tenantName: '',
        propertyTitle: '',
        propertyAddress: '',
        startDate: '',
        endDate: ''
    });
    const [htmlPreview, setHtmlPreview] = useState('');

    useEffect(() => {
        $authHost.get('api/template').then(res => {
            setTemplate(res.data.template);
        });
    }, []);

    const handleGenerate = async () => {
        const res = await $authHost.post('api/contract', data);
        setHtmlPreview(res.data.html);
    };

    const handleDownloadPDF = async () => {
        const res = await $authHost.post('api/contract/pdf', data, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contract.pdf');
        document.body.appendChild(link);
        link.click();
    };

    const handleUpdateTemplate = async () => {
        await $authHost.post('api/template', { template });
        alert('Шаблон обновлён');
    };

    return (
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">Генератор договора</h1>

            <div className="grid grid-cols-2 gap-2">
                {Object.keys(data).map(key => (
                    <input
                        key={key}
                        placeholder={key}
                        value={data[key]}
                        onChange={e => setData({ ...data, [key]: e.target.value })}
                        className="border p-2 rounded"
                    />
                ))}
            </div>

            <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 rounded">Сгенерировать договор</button>
            <button onClick={handleDownloadPDF} className="bg-green-500 text-white px-4 py-2 rounded">Скачать PDF</button>

            <div className="mt-4">
                <h2 className="text-xl font-semibold">Редактировать шаблон</h2>
                <textarea
                    className="w-full h-64 border p-2 rounded"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                />
                <button onClick={handleUpdateTemplate} className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded">Сохранить шаблон</button>
            </div>

            {htmlPreview && (
                <div className="mt-6 border p-4" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
            )}
        </div>
    );
}
