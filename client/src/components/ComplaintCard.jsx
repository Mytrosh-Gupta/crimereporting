import React from 'react';
import { Link } from 'react-router-dom';

const statusClasses = {
    'Pending': 'badge badge-pending',
    'Under Investigation': 'badge badge-investigation',
    'Resolved': 'badge badge-resolved',
};

const priorityClasses = {
    'High': 'badge badge-danger',
    'Medium': 'badge badge-warning',
    'Low': 'badge badge-info',
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
                <span className="meta-item">📂 {complaint.category || 'Processing...'}</span>
                {complaint.priority && (
                    <span className={`meta-item ${priorityClasses[complaint.priority] || 'badge badge-pending'}`} style={{ color: complaint.priority === 'High' ? 'red' : complaint.priority === 'Medium' ? 'orange' : 'inherit' }}>
                        🚨 {complaint.priority}
                    </span>
                )}
                <span className="meta-item">📍 {complaint.location}</span>
                <span className="meta-item">
                    📅 {new Date(complaint.dateOfIncident).toLocaleDateString()}
                </span>
                {complaint.isAnonymous && (
                    <span className="meta-item anon-badge">🕶️ Anonymous</span>
                )}
            </div>
            {complaint.summary && (
                <div className="complaint-card-summary" style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                    <p><em>AI Summary:</em> {complaint.summary}</p>
                </div>
            )}
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
