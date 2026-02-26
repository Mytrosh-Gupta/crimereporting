import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllComplaints } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, investigating: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAllComplaints();
                const complaints = res.data;
                setStats({
                    total: complaints.length,
                    pending: complaints.filter((c) => c.status === 'Pending').length,
                    investigating: complaints.filter((c) => c.status === 'Under Investigation').length,
                    resolved: complaints.filter((c) => c.status === 'Resolved').length,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>👮 Admin Dashboard</h1>
                    <p className="text-muted">Welcome back, {user?.name}. Here's an overview of all complaints.</p>
                </div>
                <Link to="/admin/complaints" className="btn btn-primary">Manage Complaints</Link>
            </div>

            <div className="stats-row">
                <div className="stat-box stat-total">
                    <div className="stat-box-number">{loading ? '...' : stats.total}</div>
                    <div className="stat-box-label">Total Complaints</div>
                </div>
                <div className="stat-box stat-pending">
                    <div className="stat-box-number">{loading ? '...' : stats.pending}</div>
                    <div className="stat-box-label">Pending</div>
                </div>
                <div className="stat-box stat-investigating">
                    <div className="stat-box-number">{loading ? '...' : stats.investigating}</div>
                    <div className="stat-box-label">Under Investigation</div>
                </div>
                <div className="stat-box stat-resolved">
                    <div className="stat-box-number">{loading ? '...' : stats.resolved}</div>
                    <div className="stat-box-label">Resolved</div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <div className="dashboard-card">
                    <div className="dash-card-icon">📋</div>
                    <h3>All Complaints</h3>
                    <p>View, update, and manage all submitted crime reports.</p>
                    <Link to="/admin/complaints" className="btn btn-primary">Go to Complaints</Link>
                </div>
                <div className="dashboard-card">
                    <div className="dash-card-icon">⚡</div>
                    <h3>Quick Actions</h3>
                    <p>Manage complaint statuses and add administrative remarks.</p>
                    <Link to="/admin/complaints" className="btn btn-outline">Update Status</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
