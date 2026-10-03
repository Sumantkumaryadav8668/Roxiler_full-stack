import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Store, Star, UserPlus, PlusCircle, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await adminAPI.getDashboard();
                if (res.success && res.data) {
                    setStats(res.data);
                }
            } catch (err) {
                setErrorMsg(err.message || 'Failed to fetch dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">System Administrator Dashboard</h1>
                <p className="page-subtitle">Overview of overall system users, stores, and ratings platform metrics</p>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-label">Total Registered Users</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <Store size={28} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.totalStores}</div>
                        <div className="stat-label">Total Registered Stores</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <Star size={28} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.totalRatings}</div>
                        <div className="stat-label">Total Submitted Ratings</div>
                    </div>
                </div>
            </div>

            
            <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
                <div className="quick-actions-grid">
                    <Link to="/admin/add-user" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '10px', color: '#6366f1' }}>
                                <UserPlus size={22} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', color: '#f8fafc' }}>Add New User</h4>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Create Admin, User, or Store Owner</p>
                            </div>
                        </div>
                        <ArrowUpRight size={20} color="#64748b" />
                    </Link>

                    <Link to="/admin/add-store" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: '10px', color: '#10b981' }}>
                                <PlusCircle size={22} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', color: '#f8fafc' }}>Add New Store</h4>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Register a store and assign owner</p>
                            </div>
                        </div>
                        <ArrowUpRight size={20} color="#64748b" />
                    </Link>

                    <Link to="/admin/users" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: '10px', color: '#f59e0b' }}>
                                <Users size={22} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', color: '#f8fafc' }}>Manage All Users</h4>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Filter, sort, and view user details</p>
                            </div>
                        </div>
                        <ArrowUpRight size={20} color="#64748b" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
