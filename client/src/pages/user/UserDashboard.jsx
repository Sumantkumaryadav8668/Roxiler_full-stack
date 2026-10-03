import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storeAPI } from '../../services/api';
import { Store, Star, ArrowUpRight } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStores = async () => {
            try {
                const res = await storeAPI.getStores();
                if (res.success && res.data) {
                    setStores(res.data);
                }
            } catch (err) {
                console.error('Failed to load user stores summary:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStores();
    }, []);

    const ratedStoresCount = stores.filter(s => s.user_submitted_rating !== null && s.user_submitted_rating !== undefined).length;

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Welcome back, {user?.name}!</h1>
                <p className="page-subtitle">Discover registered stores, view overall ratings, and submit your reviews</p>
            </div>

            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                        <Store size={28} />
                    </div>
                    <div>
                        <div className="stat-value">{stores.length}</div>
                        <div className="stat-label">Total Registered Stores</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <Star size={28} />
                    </div>
                    <div>
                        <div className="stat-value">{ratedStoresCount}</div>
                        <div className="stat-label">Your Submitted Ratings</div>
                    </div>
                </div>
            </div>

            
            <div style={{ marginTop: '2rem' }}>
                <Link to="/user/stores" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '12px', color: '#6366f1' }}>
                            <Store size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>Browse & Rate All Stores</h3>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                View store details, filter by location or name, and manage your ratings
                            </p>
                        </div>
                    </div>
                    <ArrowUpRight size={24} color="#6366f1" />
                </Link>
            </div>
        </div>
    );
};

export default UserDashboard;
