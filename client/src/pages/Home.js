// Home.jsx
import {useContext, useEffect} from "react";
import { observer } from "mobx-react-lite";
import PropertyCard from "../components/PropertyCard";
import SearchFilters from "../components/SearchFilters";
import Carousel from "../components/Carousel";
import {Context} from "../index";

const Home = observer(() => {
    const { propertyStore } = useContext(Context);

    useEffect(() => {
        propertyStore.fetchAll();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Поисковая строка и фильтры */}
            <SearchFilters />

            {/* Карусель популярных объектов */}
            <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">Популярные предложения</h2>
            <Carousel />

            {/* Все объекты */}
            <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">Все объекты</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {propertyStore.properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
});

export default Home;