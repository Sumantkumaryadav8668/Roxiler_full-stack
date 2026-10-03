import React, { useState, useEffect } from 'react';
import { storeAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import RatingInput from '../../components/RatingInput';
import { Star } from 'lucide-react';

const RatingUsers = () => {
    const [ratedUsers, setRatedUsers] = useState([]);
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('DESC');

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await storeAPI.getOwnerDashboard();
                if (res.success && res.data) {
                    setRatedUsers(res.data.ratedUsers || []);
                    if (res.data.store) {
                        setStoreName(res.data.store.name);
                    }
                }
            } catch (err) {
                setErrorMsg(err.message || 'Failed to fetch customer ratings list.');
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    const handleSort = (columnKey, order) => {
        setSortBy(columnKey);
        setSortOrder(order);

        const sorted = [...ratedUsers].sort((a, b) => {
            let valA = a[columnKey];
            let valB = b[columnKey];

            if (columnKey === 'rating') {
                valA = Number(valA);
                valB = Number(valB);
            }

            if (valA < valB) return order === 'ASC' ? -1 : 1;
            if (valA > valB) return order === 'ASC' ? 1 : -1;
            return 0;
        });

        setRatedUsers(sorted);
    };

    const columns = [
        {
            key: 'user_name',
            label: 'Customer Name',
            sortable: true,
            render: (val) => <span style={{ fontWeight: 700 }}>{val}</span>
        },
        {
            key: 'user_email',
            label: 'Customer Email',
            sortable: true
        },
        {
            key: 'user_address',
            label: 'Address',
            sortable: false,
            render: (val) => <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{val}</span>
        },
        {
            key: 'rating',
            label: 'Rating Given',
            sortable: true,
            render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RatingInput value={Number(val)} readOnly size={16} />
                    <span style={{ fontWeight: 800, color: '#f59e0b' }}>{val} / 5</span>
                </div>
            )
        },
        {
            key: 'updated_at',
            label: 'Date Submitted',
            sortable: true,
            render: (val) => <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
        }
    ];

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Customer Ratings for {storeName || 'Your Store'}</h1>
                <p className="page-subtitle">Complete list of registered customers who have submitted ratings for your store</p>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <DataTable
                columns={columns}
                data={ratedUsers}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                loading={loading}
                emptyMessage="No customer ratings submitted for your store yet."
            />
        </div>
    );
};

export default RatingUsers;
