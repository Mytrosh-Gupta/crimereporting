import React, { useState, useEffect } from 'react';
import { getAllComplaints, deleteComplaint } from '../../services/complaintService';
import ComplaintCard from '../../components/ComplaintCard';
import Loader from '../../components/Loader';

const STATUSES = ['All', 'Pending', 'Under Investigation', 'Resolved'];

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deleteId, setDeleteId] = useState(null);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await getAllComplaints();
            setComplaints(res.data);
            setFiltered(res.data);
        } catch (err) {
            setError('Failed to load complaints.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    useEffect(() => {
        if (statusFilter === 'All') {
            setFiltered(complaints);
        } else {
            setFiltered(complaints.filter((c) => c.status === statusFilter));
        }
    }, [statusFilter, complaints]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            await deleteComplaint(id);
            const updated = complaints.filter((c) => c._id !== id);
            setComplaints(updated);
        } catch (err) {
            setError('Failed to delete complaint.');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>📋 All Complaints</h1>
                    <p className="text-muted">{filtered.length} complaint(s) shown</p>
                </div>
                <div className="filter-group">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No complaints found</h3>
                </div>
            ) : (
                <div className="complaints-list">
                    {filtered.map((c) => (
                        <div key={c._id} className="admin-complaint-row">
                            <ComplaintCard complaint={c} basePath="/admin/complaints" />
                            <div className="admin-actions">
                                {!c.isAnonymous && c.userId && (
                                    <div className="reporter-info">
                                        <span>👤 {c.userId.name}</span>
                                        <span>{c.userId.email}</span>
                                    </div>
                                )}
                                {c.isAnonymous && <span className="badge badge-pending">Anonymous</span>}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(c._id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminComplaints;
