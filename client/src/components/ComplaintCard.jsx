import React from 'react';
import { Link } from 'react-router-dom';

const statusClasses = {
    'Pending': 'badge badge-pending',
    'Under Investigation': 'badge badge-investigation',
    'Resolved': 'badge badge-resolved',
};

const ComplaintCard = ({ complaint, basePath = '/complaints' }) => {
    return (
        <div className="complaint-card">
            <div className="complaint-card-header">
                <h3 className="complaint-title">{complaint.title}</h3>
                <span className={statusClasses[complaint.status] || 'badge badge-pending'}>
                    {complaint.status}
                </span>
            </div>
            <div className="complaint-meta">
                <span className="meta-item">📂 {complaint.category}</span>
                <span className="meta-item">📍 {complaint.location}</span>
                <span className="meta-item">
                    📅 {new Date(complaint.dateOfIncident).toLocaleDateString()}
                </span>
                {complaint.isAnonymous && (
                    <span className="meta-item anon-badge">🕶️ Anonymous</span>
                )}
            </div>
            <div className="complaint-card-footer">
                <span className="complaint-id">ID: {complaint._id}</span>
                <Link to={`${basePath}/${complaint._id}`} className="btn btn-sm btn-primary">
                    View Details →
                </Link>
            </div>
        </div>
    );
};

export default ComplaintCard;
