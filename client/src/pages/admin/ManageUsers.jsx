import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import DataTable from '../../components/DataTable';
import RatingInput from '../../components/RatingInput';
import { Eye, UserPlus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('ASC');

    
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getUsers({
                search: searchTerm,
                role: roleFilter,
                sortBy,
                sortOrder
            });
            if (res.success && res.data) {
                setUsers(res.data);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Failed to fetch users list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, sortBy, sortOrder]);

    const handleSort = (columnKey, order) => {
        setSortBy(columnKey);
        setSortOrder(order);
    };

    const handleViewUser = async (userId) => {
        setDetailLoading(true);
        try {
            const res = await adminAPI.getUserById(userId);
            if (res.success && res.data) {
                setSelectedUser(res.data);
            }
        } catch (err) {
            alert('Failed to load user details: ' + (err.message || 'Unknown error'));
        } finally {
            setDetailLoading(false);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true
        },
        {
            key: 'address',
            label: 'Address',
            sortable: true,
            render: (val) => <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{val}</span>
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (val) => {
                let badgeClass = 'badge-user';
                if (val === 'ADMIN') badgeClass = 'badge-admin';
                if (val === 'STORE_OWNER') badgeClass = 'badge-owner';
                return <span className={`badge ${badgeClass}`}>{val}</span>;
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (_, row) => (
                <button
                    onClick={() => handleViewUser(row.id)}
                    className="btn btn-secondary btn-sm"
                    title="View Full User Details"
                >
                    <Eye size={16} />
                    <span>View Details</span>
                </button>
            )
        }
    ];

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">View, filter, sort, and inspect registered system users</p>
                </div>
                <Link to="/admin/add-user" className="btn btn-primary">
                    <UserPlus size={18} />
                    <span>Add New User</span>
                </Link>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            
            <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
                <div className="filter-bar">
                    <SearchBar
                        value={searchTerm}
                        onChange={(val) => setSearchTerm(val)}
                        onClear={() => setSearchTerm('')}
                        placeholder="Search users by Name, Email, or Address..."
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} color="#94a3b8" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="form-control"
                            style={{ minWidth: '160px' }}
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER (Normal)</option>
                            <option value="STORE_OWNER">STORE_OWNER</option>
                        </select>
                    </div>
                </div>
            </div>

            
            <DataTable
                columns={columns}
                data={users}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                loading={loading}
                emptyMessage="No matching users found."
            />

            
            {selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>User Profile Details</h3>
                            <button onClick={() => setSelectedUser(null)} className="modal-close">✕</button>
                        </div>

                        {detailLoading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div className="spinner" style={{ margin: '0 auto' }}></div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{selectedUser.name}</h4>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{selectedUser.email}</p>
                                    </div>
                                    <span className={`badge ${selectedUser.role === 'ADMIN' ? 'badge-admin' : selectedUser.role === 'STORE_OWNER' ? 'badge-owner' : 'badge-user'}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>

                                <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Address</span>
                                    <p style={{ fontSize: '0.9rem', color: '#f8fafc', marginTop: '0.25rem' }}>{selectedUser.address}</p>
                                </div>

                                
                                {selectedUser.role === 'STORE_OWNER' && (
                                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Associated Store Details</span>
                                        {selectedUser.store ? (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                                                    {selectedUser.store.name}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Store Overall Rating:</span>
                                                    <RatingInput value={Number(selectedUser.store.overall_rating)} readOnly size={16} />
                                                    <strong style={{ color: '#f59e0b' }}>
                                                        {Number(selectedUser.store.overall_rating).toFixed(1)} / 5
                                                    </strong>
                                                </div>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem', fontStyle: 'italic' }}>
                                                No store currently assigned to this owner.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button onClick={() => setSelectedUser(null)} className="btn btn-secondary">
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
