// CreatePropertyForm.jsx
import React, {useContext, useState} from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { HOMEROUTER } from "../utils/consts";
import {Context} from "../index";

const CreatePropertyForm = observer(() => {
    const { propertyStore } = useContext(Context);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("apartment");
    const [rooms, setRooms] = useState(1);
    const [area, setArea] = useState("");
    const [floor, setFloor] = useState("");
    const [totalFloors, setTotalFloors] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const amenityOptions = [
        {id: "wifi", name: "Wi-Fi"},
        {id: "tv", name: "Телевизор"},
        {id: "kitchen", name: "Кухня"},
        {id: "parking", name: "Парковка"},
        {id: "washer", name: "Стиральная машина"},
        {id: "conditioner", name: "Кондиционер"},
        {id: "balcony", name: "Балкон"},
        {id: "furniture", name: "Мебель"},
    ];

    const toggleAmenity = (amenity) => {
        setAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);

        // Создаем превью для изображений
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("location", location);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("rooms", rooms);
        formData.append("area", area);
        formData.append("floor", floor);
        formData.append("totalFloors", totalFloors);
        formData.append("amenities", JSON.stringify(amenities));
        for (let i = 0; i < photos.length; i++) {
            formData.append("photos", photos[i]);
        }

        try {
            await propertyStore.create(formData);
            navigate("/profile"); // Возвращаемся в профиль
        } catch (e) {
            console.error("Ошибка создания:", e);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Создать объявление</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Левая колонка */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок *</label>
                            <input
                                type="text"
                                placeholder="Например: Сдам 2-комнатную квартиру в центре"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Местоположение *</label>
                            <input
                                type="text"
                                placeholder="Город, улица, дом"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                            <textarea
                                placeholder="Подробное описание объекта"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽) *</label>
                            <input
                                type="number"
                                placeholder="Например: 35000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />
                        </div>
                    </div>

                    {/* Правая колонка */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Тип жилья *</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="apartment">Квартира</option>
                                <option value="house">Дом</option>
                                <option value="room">Комната</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Комнат *</label>
                                <select
                                    value={rooms}
                                    onChange={(e) => setRooms(Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} комн.</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Площадь (м²) *</label>
                                <input
                                    type="number"
                                    placeholder="Например: 65"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Этаж *</label>
                                <input
                                    type="number"
                                    placeholder="Например: 5"
                                    value={floor}
                                    onChange={(e) => setFloor(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Этажей в доме *</label>
                                <input
                                    type="number"
                                    placeholder="Например: 9"
                                    value={totalFloors}
                                    onChange={(e) => setTotalFloors(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Удобства</label>
                            <div className="grid grid-cols-2 gap-3">
                                {amenityOptions.map((amenity) => (
                                    <label
                                        key={amenity.id}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={amenities.includes(amenity.id)}
                                            onChange={() => toggleAmenity(amenity.id)}
                                        />
                                        <div className={`w-5 h-5 flex items-center justify-center mr-2 border rounded ${
                                            amenities.includes(amenity.id)
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300'
                                        }`}>
                                            {amenities.includes(amenity.id) && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-gray-700">{amenity.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Загрузка фото */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Фотографии *</label>
                    <p className="text-gray-500 text-sm mb-3">Добавьте до 10 фотографий. Первое фото будет на обложке.</p>

                    <div className="flex flex-wrap gap-4 mb-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`Preview ${index}`}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newUrls = [...previewUrls];
                                        newUrls.splice(index, 1);
                                        setPreviewUrls(newUrls);

                                        const newPhotos = [...photos];
                                        newPhotos.splice(index, 1);
                                        setPhotos(newPhotos);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {previewUrls.length < 10 && (
                            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-xs text-gray-500">Добавить</span>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Кнопка отправки */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={propertyStore.isLoading}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                        {propertyStore.isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Сохранение...
                            </>
                        ) : "Опубликовать объявление"}
                    </button>

                    {propertyStore.error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                            {propertyStore.error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
});

export default CreatePropertyForm;