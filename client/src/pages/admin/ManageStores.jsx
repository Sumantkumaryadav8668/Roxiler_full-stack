import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import DataTable from '../../components/DataTable';
import RatingInput from '../../components/RatingInput';
import { PlusCircle, Store } from 'lucide-react';

const ManageStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('ASC');

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getStores({
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

    const handleSort = (columnKey, order) => {
        setSortBy(columnKey);
        setSortOrder(order);
    };

    const columns = [
        {
            key: 'name',
            label: 'Store Name',
            sortable: true,
            render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Store size={18} color="#6366f1" />
                    <span style={{ fontWeight: 700 }}>{val}</span>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Store Email',
            sortable: true
        },
        {
            key: 'address',
            label: 'Address',
            sortable: true,
            render: (val) => <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{val}</span>
        },
        {
            key: 'overall_rating',
            label: 'Rating',
            sortable: true,
            render: (val, row) => {
                const numVal = Number(val) || 0;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RatingInput value={numVal} readOnly size={16} />
                        <span style={{ fontWeight: 800, color: '#f59e0b' }}>
                            {numVal.toFixed(1)} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({row.total_ratings || 0})</span>
                        </span>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Stores Management</h1>
                    <p className="page-subtitle">View and sort registered stores and overall ratings</p>
                </div>
                <Link to="/admin/add-store" className="btn btn-primary">
                    <PlusCircle size={18} />
                    <span>Add New Store</span>
                </Link>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            
            <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
                <SearchBar
                    value={searchTerm}
                    onChange={(val) => setSearchTerm(val)}
                    onClear={() => setSearchTerm('')}
                    placeholder="Search stores by Name or Address..."
                />
            </div>

            
            <DataTable
                columns={columns}
                data={stores}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                loading={loading}
                emptyMessage="No matching stores found."
            />
        </div>
    );
};

export default ManageStores;
