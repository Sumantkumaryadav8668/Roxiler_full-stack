import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
    value,
    onChange,
    placeholder = 'Search by Name or Address...',
    onClear
}) => {
    return (
        <div className="search-bar-wrapper">
            <Search
                size={18}
                color="#94a3b8"
                style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="form-control"
                style={{
                    paddingLeft: '2.75rem',
                    paddingRight: value ? '2.5rem' : '1rem'
                }}
            />
            {value && onClear && (
                <button
                    onClick={onClear}
                    style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '0.2rem'
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
