import React from 'react';

const ItemsPerPageSelect = ({ onChange, currentValue }) => {
    const options = [12, 24, 48];

    const handleChange = (e) => {
        const value = parseInt(e.target.value);
        onChange(value);
    };

    return (
        <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">На странице:</label>
            <select
                value={currentValue}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ItemsPerPageSelect;