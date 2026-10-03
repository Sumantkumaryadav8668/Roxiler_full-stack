import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import StoreCard from '../../components/StoreCard';
import { Store, Filter } from 'lucide-react';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('ASC');

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await storeAPI.getStores({
                search: searchTerm,
                sortBy,
                sortOrder
            });
            if (res.success && res.data) {
                setStores(res.data);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Failed to fetch stores list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [searchTerm, sortBy, sortOrder]);

    const handleRatingSubmit = async (store, ratingValue) => {
        try {
            if (store.user_rating_id) {
                
                await ratingAPI.updateRating(store.user_rating_id, { rating: ratingValue });
            } else {
                
                await ratingAPI.submitRating({ store_id: store.id, rating: ratingValue });
            }
            
            await fetchStores();
        } catch (err) {
            throw new Error(err.message || 'Rating submission failed.');
        }
    };

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Registered Stores</h1>
                <p className="page-subtitle">Search stores by Name or Address and submit your reviews</p>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem 1.25rem' }}>
                <div className="filter-bar">
                    <SearchBar
                        value={searchTerm}
                        onChange={(val) => setSearchTerm(val)}
                        onClear={() => setSearchTerm('')}
                        placeholder="Search stores by Name or Address..."
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} color="#94a3b8" />
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="form-control"
                            style={{ minWidth: '180px' }}
                        >
                            <option value="name-ASC">Name (A-Z)</option>
                            <option value="name-DESC">Name (Z-A)</option>
                            <option value="overall_rating-DESC">Highest Rated</option>
                            <option value="overall_rating-ASC">Lowest Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '36px', height: '36px' }}></div>
                    <p style={{ color: '#94a3b8' }}>Loading stores...</p>
                </div>
            ) : stores.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Store size={48} color="#64748b" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem' }}>No Stores Found</h3>
                    <p style={{ color: '#94a3b8' }}>Try clearing your search or changing the filter options.</p>
                </div>
            ) : (
                <div className="store-grid">
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onRate={handleRatingSubmit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoreList;
