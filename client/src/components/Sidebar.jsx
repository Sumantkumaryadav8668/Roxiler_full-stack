import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Store,
    UserPlus,
    PlusCircle,
    Star
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();
    if (!user) return null;

    const navItemStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        color: isActive ? '#ffffff' : '#94a3b8',
        backgroundColor: isActive ? '#6366f1' : 'transparent',
        fontWeight: isActive ? 700 : 500,
        textDecoration: 'none',
        fontSize: '0.95rem',
        transition: 'all 0.2s ease',
        marginBottom: '0.35rem'
    });

    return (
        <aside className="sidebar-aside">
            <div className="sidebar-header-label">
                {user.role} NAVIGATION
            </div>

            <div className="sidebar-nav-container">
                
                {user.role === 'ADMIN' && (
                    <>
                        <NavLink to="/admin/dashboard" style={navItemStyle} className="sidebar-nav-item">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/admin/users" style={navItemStyle} className="sidebar-nav-item">
                            <Users size={18} />
                            <span>Manage Users</span>
                        </NavLink>
                        <NavLink to="/admin/stores" style={navItemStyle} className="sidebar-nav-item">
                            <Store size={18} />
                            <span>Manage Stores</span>
                        </NavLink>
                        <NavLink to="/admin/add-user" style={navItemStyle} className="sidebar-nav-item">
                            <UserPlus size={18} />
                            <span>Add New User</span>
                        </NavLink>
                        <NavLink to="/admin/add-store" style={navItemStyle} className="sidebar-nav-item">
                            <PlusCircle size={18} />
                            <span>Add New Store</span>
                        </NavLink>
                    </>
                )}

                
                {user.role === 'USER' && (
                    <>
                        <NavLink to="/user/dashboard" style={navItemStyle} className="sidebar-nav-item">
                            <LayoutDashboard size={18} />
                            <span>My Dashboard</span>
                        </NavLink>
                        <NavLink to="/user/stores" style={navItemStyle} className="sidebar-nav-item">
                            <Store size={18} />
                            <span>Browse Stores</span>
                        </NavLink>
                    </>
                )}

                
                {user.role === 'STORE_OWNER' && (
                    <>
                        <NavLink to="/owner/dashboard" style={navItemStyle} className="sidebar-nav-item">
                            <LayoutDashboard size={18} />
                            <span>Owner Dashboard</span>
                        </NavLink>
                        <NavLink to="/owner/ratings" style={navItemStyle} className="sidebar-nav-item">
                            <Star size={18} />
                            <span>Store Ratings</span>
                        </NavLink>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
