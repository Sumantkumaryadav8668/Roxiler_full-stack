import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
        const errors = error.response?.data?.errors || [];
        return Promise.reject({ message, errors, status: error.response?.status });
    }
);


export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    changePassword: (data) => api.put('/auth/change-password', data),
    getProfile: () => api.get('/users/profile')
};


export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    addUser: (userData) => api.post('/admin/users', userData),
    addStore: (storeData) => api.post('/admin/stores', storeData),
    getUsers: (params) => api.get('/admin/users', { params }),
    getStores: (params) => api.get('/admin/stores', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`)
};


export const storeAPI = {
    getStores: (params) => api.get('/stores', { params }),
    getStoreById: (id) => api.get(`/stores/${id}`),
    getOwnerDashboard: () => api.get('/stores/owner/dashboard')
};


export const ratingAPI = {
    submitRating: (data) => api.post('/ratings', data),
    updateRating: (id, data) => api.put(`/ratings/${id}`, data),
    getStoreRatings: (storeId) => api.get(`/ratings/store/${storeId}`)
};

export default api;
