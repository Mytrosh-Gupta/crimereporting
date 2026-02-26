import api from './api';

export const submitComplaint = (formData) =>
    api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getMyComplaints = () => api.get('/complaints/my');

export const getComplaintById = (id) => api.get(`/complaints/${id}`);

// Admin
export const getAllComplaints = () => api.get('/complaints');

export const updateComplaintStatus = (id, data) =>
    api.put(`/complaints/${id}/status`, data);

export const deleteComplaint = (id) => api.delete(`/complaints/${id}`);
