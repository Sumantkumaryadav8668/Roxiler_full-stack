import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, Key, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'ADMIN': return 'badge-admin';
            case 'STORE_OWNER': return 'badge-owner';
            default: return 'badge-user';
        }
    };

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo-icon">
                        <Store size={22} color="#ffffff" />
                    </div>
                    <span className="navbar-brand-text">Roxiler<span style={{ color: '#6366f1' }}>Stores</span></span>
                </Link>

                
                {user ? (
                    <div className="navbar-user-controls">
                        <div className="navbar-user-info">
                            <div className="navbar-avatar">
                                <UserIcon size={18} color="#94a3b8" />
                            </div>
                            <div className="navbar-user-details">
                                <span className="navbar-user-name" title={user.name}>
                                    {user.name}
                                </span>
                                <span className={`badge ${getRoleBadgeClass(user.role)} navbar-badge`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="navbar-divider"></div>

                        <div className="navbar-actions">
                            <Link to="/change-password" className="btn btn-secondary btn-sm navbar-btn" title="Change Password">
                                <Key size={16} />
                                <span className="navbar-btn-label">Password</span>
                            </Link>

                            <button onClick={handleLogout} className="btn btn-danger btn-sm navbar-btn" title="Logout">
                                <LogOut size={16} />
                                <span className="navbar-btn-label">Logout</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="navbar-actions">
                        <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                        <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
