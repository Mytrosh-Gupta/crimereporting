import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitComplaint } from '../services/complaintService';

const CATEGORIES = ['Theft', 'Assault', 'Cybercrime', 'Harassment', 'Other'];

const ReportCrime = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        dateOfIncident: '',
        isAnonymous: false,
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.category) {
            return setError('Please select a category');
        }

        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => data.append(key, val));
            if (file) data.append('evidenceFile', file);

            const res = await submitComplaint(data);
            setSuccess(`Complaint submitted successfully! Your Complaint ID: ${res.data.complaintId}`);
            setTimeout(() => navigate('/my-complaints'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🚨 Report a Crime</h1>
                <p>Fill in the details below. All submissions are secure and confidential.</p>
            </div>

            <div className="form-card">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Crime Title *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Brief title of the incident"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date of Incident *</label>
                            <input
                                type="date"
                                name="dateOfIncident"
                                value={formData.dateOfIncident}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location *</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Where did the incident occur?"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Describe the incident in detail..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Evidence (Optional)</label>
                        <div className="file-upload-area">
                            <input
                                type="file"
                                id="evidenceFile"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="evidenceFile" className="file-upload-label">
                                {file ? (
                                    <span>✅ {file.name}</span>
                                ) : (
                                    <span>📎 Click to upload image or video (max 10MB)</span>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="isAnonymous"
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={handleChange}
                        />
                        <label htmlFor="isAnonymous">
                            🕶️ Submit this report anonymously
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : '🚀 Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportCrime;
