import axios from 'axios';

const api = axios.create({
    baseURL: 'https://onlinecrimereportingsystem.onrender.com/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('crToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
