import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🚔 Online Crime Reporting Portal</div>
                    <h1 className="hero-title">
                        Report Crime.<br />
                        <span className="hero-highlight">Stay Safe. Stay Heard.</span>
                    </h1>
                    <p className="hero-subtitle">
                        A secure and confidential platform to report crimes online. Your complaint reaches authorities instantly.
                    </p>
                    <div className="hero-actions">
                        {user ? (
                            <>
                                <Link to="/report" className="btn btn-primary btn-lg">Report a Crime</Link>
                                <Link to="/my-complaints" className="btn btn-outline btn-lg">My Complaints</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                                <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-icon-big">🛡️</div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2 className="section-title">How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Register & Login</h3>
                        <p>Create a secure account to submit and track your complaints.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚨</div>
                        <h3>Report a Crime</h3>
                        <p>Fill out the complaint form with details, category, location and upload evidence.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Status</h3>
                        <p>Monitor your complaint status – Pending, Under Investigation, or Resolved.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🕶️</div>
                        <h3>Anonymous Reports</h3>
                        <p>Submit reports anonymously to protect your identity if needed.</p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Secure & Encrypted</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Available Online</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">Fast</div>
                        <div className="stat-label">Instant Submission</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
