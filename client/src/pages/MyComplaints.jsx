import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyComplaints } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';
import Loader from '../components/Loader';

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await getMyComplaints();
                setComplaints(res.data);
            } catch (err) {
                setError('Failed to load complaints. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>📋 My Complaints</h1>
                    <p className="text-muted">All complaints you have submitted</p>
                </div>
                <Link to="/report" className="btn btn-primary">+ New Report</Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {complaints.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No complaints yet</h3>
                    <p>You haven't submitted any complaint reports yet.</p>
                    <Link to="/report" className="btn btn-primary">Submit Your First Report</Link>
                </div>
            ) : (
                <div className="complaints-list">
                    {complaints.map((c) => (
                        <ComplaintCard key={c._id} complaint={c} basePath="/complaints" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyComplaints;
