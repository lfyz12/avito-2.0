// Home.jsx
import {useContext, useEffect, useState} from "react";
import { observer } from "mobx-react-lite";
import PropertyCard from "../components/PropertyCard";
import SearchFilters from "../components/SearchFilters";
import Carousel from "../components/Carousel";
import Pagination from "../components/Pagination";
import SortSelect from "../components/SortSelected";
import ItemsPerPageSelect from "../components/ItemsPerPageSelect";
import {Context} from "../index";

const Home = observer(() => {
    const { propertyStore, likeStore } = useContext(Context);

    useEffect(() => {
        propertyStore.fetchProperties();
        likeStore.fetchLikedProperties();
    }, []);

    const handlePageChange = (page) => {
        propertyStore.changePage(page);
    };

    const handleItemsPerPageChange = (itemsPerPage) => {
        propertyStore.changeItemsPerPage(itemsPerPage);
    };

    const handleFilterChange = (newFilters) => {
        propertyStore.applyFilters(newFilters);
    };

    const handleSortChange = (newSort) => {
        propertyStore.applySort(newSort);
    };


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <SearchFilters
                onFilterChange={handleFilterChange}
                initialFilters={propertyStore.filters}
            />

            <Carousel />

            <div className="flex justify-between items-center mt-10 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Все объекты</h2>

                <div className="flex items-center space-x-4">
                    <SortSelect
                        onSortChange={handleSortChange}
                        currentSort={propertyStore.sort}
                    />

                    <ItemsPerPageSelect
                        onChange={handleItemsPerPageChange}
                        currentValue={propertyStore.pagination.itemsPerPage}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {propertyStore.properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            <Pagination
                currentPage={propertyStore.pagination.currentPage}
                totalPages={propertyStore.pagination.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
});

export default Home;