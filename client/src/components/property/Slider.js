import React, {useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import '../../styles/swiper.css'
import LazyImage from "../LazyImage";
const Slider = ({property}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="mb-8">
            <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{swiper: thumbsSwiper}}
                modules={[Navigation, Thumbs, FreeMode]}
                className="property-main-swiper rounded-xl mb-2"
            >
                {property.photos.map((photo, index) => (
                    <SwiperSlide key={index}>
                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                            <LazyImage
                                src={process.env.REACT_APP_API_URL + 'static/' + photo}
                                alt={`Фото ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="property-thumbs-swiper"
            >
                {property.photos.map((photo, index) => (
                    <SwiperSlide key={index}>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                            <LazyImage
                                src={process.env.REACT_APP_API_URL + 'static/' + photo}
                                alt={`Фото ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;