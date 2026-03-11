import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getComplaintById } from '../services/complaintService';
import Loader from '../components/Loader';

const STATUS_CLASS = {
    'Pending': 'badge badge-pending',
    'Under Investigation': 'badge badge-investigation',
    'Resolved': 'badge badge-resolved',
};

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await getComplaintById(id);
                setComplaint(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Complaint not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    if (loading) return <Loader />;
    if (error) return (
        <div className="page-container">
            <div className="alert alert-error">{error}</div>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Complaint Details</h1>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
            </div>

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
                        <span className="detail-label">Submitted On</span>
                        <span className="detail-value">
                            {new Date(complaint.createdAt).toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Anonymous</span>
                        <span className="detail-value">{complaint.isAnonymous ? '✅ Yes' : '❌ No'}</span>
                    </div>
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
                                src={`https://onlinecrimereportingsystem.onrender.com/uploads/${complaint.evidenceFile}`}
                                alt="Evidence"
                                className="evidence-image"
                            />
                        ) : (
                            <a
                                href={`https://onlinecrimereportingsystem.onrender.com/uploads/${complaint.evidenceFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline"
                            >
                                🎥 View Video Evidence
                            </a>
                        )}
                    </div>
                )}

                {complaint.adminRemarks && (
                    <div className="detail-section remarks-section">
                        <h3>👮 Admin Remarks</h3>
                        <p>{complaint.adminRemarks}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintDetails;
