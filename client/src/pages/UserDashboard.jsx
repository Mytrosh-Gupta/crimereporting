import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {user?.name}! 👋</h1>
                    <p className="text-muted">Manage your complaints and submissions here.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="dash-card-icon">🚨</div>
                    <h3>Report a Crime</h3>
                    <p>Submit a new crime report with evidence and details.</p>
                    <Link to="/report" className="btn btn-primary">Report Now</Link>
                </div>
                <div className="dashboard-card">
                    <div className="dash-card-icon">📋</div>
                    <h3>My Complaints</h3>
                    <p>View and track all your submitted complaints.</p>
                    <Link to="/my-complaints" className="btn btn-outline">View All</Link>
                </div>
                <div className="dashboard-card">
                    <div className="dash-card-icon">👤</div>
                    <h3>My Profile</h3>
                    <p>Email: {user?.email}</p>
                    <p>Phone: {user?.phone}</p>
                    <span className="badge badge-resolved">Active Account</span>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
