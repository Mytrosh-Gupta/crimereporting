import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-icon">🚔</span>
                <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="navbar-title">CrimeReport</Link>
            </div>
            <div className="navbar-links">
                {!user ? (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link btn-nav">Register</Link>
                    </>
                ) : user.role === 'admin' ? (
                    <>
                        <Link to="/admin" className="nav-link">Dashboard</Link>
                        <Link to="/admin/complaints" className="nav-link">Complaints</Link>
                        <Link to="/admin/analytics" className="nav-link">Analytics</Link>
                        <button onClick={handleLogout} className="nav-link btn-nav btn-danger">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/report" className="nav-link">Report Crime</Link>
                        <Link to="/my-complaints" className="nav-link">My Complaints</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button onClick={handleLogout} className="nav-link btn-nav btn-danger">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
