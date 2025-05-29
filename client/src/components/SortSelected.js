import React from 'react';

const SortSelect = ({ onSortChange, currentSort }) => {
    const sortOptions = [
        { value: 'createdAt_desc', label: 'Сначала новые', by: 'createdAt', order: 'DESC' },
        { value: 'createdAt_asc', label: 'Сначала старые', by: 'createdAt', order: 'ASC' },
        { value: 'price_desc', label: 'Цена по убыванию', by: 'price', order: 'DESC' },
        { value: 'price_asc', label: 'Цена по возрастанию', by: 'price', order: 'ASC' },
        { value: 'area_desc', label: 'Площадь по убыванию', by: 'area', order: 'DESC' },
        { value: 'area_asc', label: 'Площадь по возрастанию', by: 'area', order: 'ASC' },
    ];

    const currentValue = `${currentSort.by}_${currentSort.order.toLowerCase()}`;

    const handleChange = (e) => {
        const value = e.target.value;
        const [by, order] = value.split('_');
        onSortChange({ by, order: order.toUpperCase() });
    };

    return (
        <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">Сортировка:</label>
            <select
                value={currentValue}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortSelect;