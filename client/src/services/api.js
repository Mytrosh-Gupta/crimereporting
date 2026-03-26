import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000/api' 
    : 'https://crimereporting-uqln.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
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
