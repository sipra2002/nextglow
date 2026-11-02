import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search serums, sunscreens, moisturizers...' }) => {
  return (
    <div className="position-relative w-100">
      <i
        className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6"
      ></i>
      <input
        type="text"
        className="form-control rounded-pill ps-5 pe-4 py-2 border shadow-sm"
        style={{ borderColor: '#E8D9C8', fontSize: '0.95rem' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 bg-transparent p-1"
          onClick={() => onChange('')}
          type="button"
          title="Clear search"
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
