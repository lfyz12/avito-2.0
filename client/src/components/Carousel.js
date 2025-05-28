// Carousel.jsx
import React from "react";
import PropertyCard from "./PropertyCard";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import {Context} from "../index";

const Carousel = () => {
    const { propertyStore } = useContext(Context);

    // Берем топ 5 объектов
    const topProperties = propertyStore.properties.slice(0, 5);

    return (
        <div className="relative w-full">
            <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
                {topProperties.map((property) => (
                    <div
                        key={property.id}
                        className="min-w-[280px] sm:min-w-[300px] flex-shrink-0"
                    >
                        <PropertyCard property={property} />
                    </div>
                ))}
            </div>

            {/* Индикаторы прокрутки (опционально) */}
            <div className="flex justify-center mt-4 space-x-2">
                {topProperties.map((_, index) => (
                    <div
                        key={index}
                        className="w-2.5 h-2.5 rounded-full bg-gray-300"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default observer(Carousel);