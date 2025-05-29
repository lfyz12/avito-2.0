// components/LazyImage.jsx
import React, { useRef, useState, useEffect } from 'react';
import {observer} from "mobx-react-lite";

const LazyImage = ({ src, alt, className }) => {
    const imgRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoaded) {
                    // Загружаем изображение при попадании в область видимости
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        if (imgRef.current) {
                            imgRef.current.src = src;
                            setIsLoaded(true);
                        }
                    };
                    observer.disconnect();
                }
            });
        }, { rootMargin: '200px 0px' });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src, isLoaded]);

    return (
        <img
            ref={imgRef}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
                transition: 'opacity 0.3s ease-in-out',
                backgroundColor: isLoaded ? 'transparent' : '#f3f4f6'
            }}
        />
    );
};

export default observer(LazyImage);