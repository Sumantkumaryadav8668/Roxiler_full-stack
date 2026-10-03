import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';


import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';


import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStores from './pages/admin/ManageStores';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';


import UserDashboard from './pages/user/UserDashboard';
import StoreList from './pages/user/StoreList';


import OwnerDashboard from './pages/owner/OwnerDashboard';
import RatingUsers from './pages/owner/RatingUsers';


const RootRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
};

const App = () => {
    const { user } = useAuth();

    return (
        <div className="app-container">
            <Navbar />
            <div className="main-content-layout">
                {user && <Sidebar />}
                <main style={{ flex: 1, backgroundColor: '#0f172a', minHeight: 'calc(100vh - 72px)' }}>
                    <Routes>
                        
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        
                        <Route path="/" element={<RootRedirect />} />

                        
                        <Route element={<ProtectedRoute />}>
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>

                        
                        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<ManageUsers />} />
                            <Route path="/admin/stores" element={<ManageStores />} />
                            <Route path="/admin/add-user" element={<AddUser />} />
                            <Route path="/admin/add-store" element={<AddStore />} />
                        </Route>

                        
                        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                            <Route path="/user/dashboard" element={<UserDashboard />} />
                            <Route path="/user/stores" element={<StoreList />} />
                        </Route>

                        
                        <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
                            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                            <Route path="/owner/ratings" element={<RatingUsers />} />
                        </Route>

                        
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;
