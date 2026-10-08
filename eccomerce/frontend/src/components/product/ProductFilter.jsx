import React from 'react';

export default function ProductFilter({ selectedCategory, onSelectCategory, totalCount }) {
  const categories = [
    { key: 'all', label: `All (${totalCount || 0})` },
    { key: 'men', label: 'Men' },
    { key: 'female', label: 'Female' }, // Filters items with category: 'female'
    { key: 'kids', label: 'Kids' },
  ];

  return (
    <div className="btn-group btn-group-sm" role="group">
      {categories.map((cat) => (
        <button
          key={cat.key}
          type="button"
          className={`btn ${selectedCategory === cat.key ? 'btn-warning fw-bold text-dark' : 'btn-outline-dark'}`}
          onClick={() => onSelectCategory(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}