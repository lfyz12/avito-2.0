import React, { useContext, useEffect, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { observer } from "mobx-react-lite";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// Импортируем стили Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {Context} from "../index";

const Carousel = () => {
    const { propertyStore } = useContext(Context);
    const swiperRef = useRef(null);

    // Берем топ 5 объектов
    const topProperties = propertyStore.properties.slice(0, 5);

    // Если объектов меньше 5, дублируем их для бесконечной карусели
    const carouselItems = topProperties.length < 5
        ? [...topProperties, ...topProperties.slice(0, 5 - topProperties.length)]
        : topProperties;

    // Настройки для Swiper
    const swiperConfig = {
        modules: [Navigation, Pagination, Autoplay],
        spaceBetween: 16,
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            clickable: true,
        },
        // navigation: true,
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1280: {
                slidesPerView: 4,
            }
        }
    };

    return (
        <div className="relative w-full">
            <Swiper
                {...swiperConfig}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="mySwiper"
            >
                {carouselItems.map((property, index) => (
                    <SwiperSlide key={`${property.id}-${index}`}>
                        <div className="pb-8 px-1">
                            <PropertyCard property={property} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Кастомные кнопки навигации */}
            {/*<div className="hidden md:flex justify-center mt-6 space-x-4">*/}
            {/*    <button*/}
            {/*        onClick={() => swiperRef.current?.slidePrev()}*/}
            {/*        className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"*/}
            {/*        aria-label="Previous slide"*/}
            {/*    >*/}
            {/*        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />*/}
            {/*        </svg>*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*        onClick={() => swiperRef.current?.slideNext()}*/}
            {/*        className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"*/}
            {/*        aria-label="Next slide"*/}
            {/*    >*/}
            {/*        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />*/}
            {/*        </svg>*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    );
};

export default observer(Carousel);