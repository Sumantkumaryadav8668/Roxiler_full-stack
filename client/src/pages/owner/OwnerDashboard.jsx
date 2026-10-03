import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storeAPI } from '../../services/api';
import RatingInput from '../../components/RatingInput';
import { Store, Star, Users, MapPin, ArrowUpRight } from 'lucide-react';

const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const res = await storeAPI.getOwnerDashboard();
                if (res.success && res.data) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                setErrorMsg(err.message || 'Failed to load store owner dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerData();
    }, []);

    if (loading) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Loading Owner Dashboard...</p>
            </div>
        );
    }

    if (errorMsg || !dashboardData) {
        return (
            <div className="page-container">
                <div className="alert alert-danger">
                    {errorMsg || 'No store currently linked to your owner account.'}
                </div>
            </div>
        );
    }

    const { store, averageRating, totalRatings, ratedUsers } = dashboardData;

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Store Owner Dashboard</h1>
                <p className="page-subtitle">Track customer ratings, performance statistics, and customer reviews</p>
            </div>

            
            <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '14px', color: '#6366f1' }}>
                        <Store size={36} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{store.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                            <MapPin size={16} color="#64748b" />
                            <span>{store.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <Star size={28} />
                    </div>
                    <div>
                        <div className="stat-value" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {averageRating.toFixed(1)}
                            <RatingInput value={averageRating} readOnly size={18} />
                        </div>
                        <div className="stat-label">Average Customer Rating</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <div className="stat-value">{totalRatings}</div>
                        <div className="stat-label">Total Rating Submissions</div>
                    </div>
                </div>
            </div>

            
            <div style={{ marginTop: '2rem' }}>
                <Link to="/owner/ratings" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: '10px', color: '#10b981' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700 }}>View Customer Ratings List</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>See names, emails, and individual ratings submitted for your store</p>
                        </div>
                    </div>
                    <ArrowUpRight size={20} color="#10b981" />
                </Link>
            </div>
        </div>
    );
};

export default OwnerDashboard;
