import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateComplaintStatus, deleteComplaint } from '../../services/complaintService';
import Loader from '../../components/Loader';

const STATUS_OPTIONS = ['Pending', 'Under Investigation', 'Resolved'];

const STATUS_CLASS = {
    'Pending': 'badge badge-pending',
    'Under Investigation': 'badge badge-investigation',
    'Resolved': 'badge badge-resolved',
};

const AdminComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await getComplaintById(id);
                setComplaint(res.data);
                setNewStatus(res.data.status);
                setRemarks(res.data.adminRemarks || '');
            } catch (err) {
                setError(err.response?.data?.message || 'Complaint not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    const handleUpdate = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const res = await updateComplaintStatus(id, { status: newStatus, adminRemarks: remarks });
            setComplaint(res.data.complaint);
            setSuccess('Complaint updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update complaint.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return;
        try {
            await deleteComplaint(id);
            navigate('/admin/complaints');
        } catch (err) {
            setError('Failed to delete complaint.');
        }
    };

    if (loading) return <Loader />;
    if (error && !complaint) return (
        <div className="page-container">
            <div className="alert alert-error">{error}</div>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>👮 Complaint Management</h1>
                <div className="btn-group">
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
                    <button className="btn btn-danger" onClick={handleDelete}>🗑️ Delete</button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="detail-card">
                <div className="detail-card-header">
                    <h2>{complaint.title}</h2>
                    <span className={STATUS_CLASS[complaint.status] || 'badge badge-pending'}>
                        {complaint.status}
                    </span>
                </div>

                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">Complaint ID</span>
                        <span className="detail-value mono">{complaint._id}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{complaint.category}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{complaint.location}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Date of Incident</span>
                        <span className="detail-value">
                            {new Date(complaint.dateOfIncident).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Submitted</span>
                        <span className="detail-value">{new Date(complaint.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Anonymous</span>
                        <span className="detail-value">{complaint.isAnonymous ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    {!complaint.isAnonymous && complaint.userId && (
                        <>
                            <div className="detail-item">
                                <span className="detail-label">Reported By</span>
                                <span className="detail-value">{complaint.userId.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Reporter Email</span>
                                <span className="detail-value">{complaint.userId.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Reporter Phone</span>
                                <span className="detail-value">{complaint.userId.phone}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="detail-section">
                    <h3>Description</h3>
                    <p className="detail-description">{complaint.description}</p>
                </div>

                {complaint.evidenceFile && (
                    <div className="detail-section">
                        <h3>Evidence</h3>
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(complaint.evidenceFile) ? (
                            <img
                                src={`http://localhost:5000/uploads/${complaint.evidenceFile}`}
                                alt="Evidence"
                                className="evidence-image"
                            />
                        ) : (
                            <a
                                href={`http://localhost:5000/uploads/${complaint.evidenceFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline"
                            >
                                🎥 View Video Evidence
                            </a>
                        )}
                    </div>
                )}

                {/* Admin Actions */}
                <div className="detail-section admin-update-section">
                    <h3>⚙️ Update Complaint</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Admin Remarks</label>
                        <textarea
                            rows="4"
                            placeholder="Add remarks about this complaint..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                        {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminComplaintDetails;
