import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BACKEND_URL = 'https://crimereporting-uqln.onrender.com';

const UserProfile = () => {
    const { user, login, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchComplaints();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setProfile(res.data);
            setForm({ name: res.data.name, phone: res.data.phone, address: res.data.address || '' });
        } catch {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/my');
            setComplaints(res.data);
        } catch {}
    };

    const handleSave = async () => {
        setSaving(true); setError(''); setSuccess('');
        try {
            const res = await api.put('/auth/profile', form);
            setProfile(prev => ({ ...prev, ...res.data.user }));
            // Update stored user so navbar reflects name change
            login(res.data.user, token);
            setSuccess('Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handlePwChange = async (e) => {
        e.preventDefault();
        setPwError(''); setPwSuccess('');
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return setPwError('Passwords do not match');
        }
        try {
            await api.put('/auth/profile', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwSuccess('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.response?.data?.message || 'Password change failed');
        }
    };

    const handlePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('profilePicture', file);
        setUploadingPic(true);
        try {
            const res = await api.put('/auth/profile/picture', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
            setSuccess('Profile picture updated!');
        } catch {
            setError('Picture upload failed');
        } finally {
            setUploadingPic(false);
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        investigating: complaints.filter(c => c.status === 'Under Investigation').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    const avatarUrl = profile?.profilePicture
        ? `${BACKEND_URL}/uploads/${profile.profilePicture}`
        : null;

    if (loading) return (
        <div className="profile-loading">
            <div className="spinner"></div>
            <p>Loading profile...</p>
        </div>
    );

    return (
        <div className="profile-page">
            {/* Hero Banner */}
            <div className="profile-hero">
                <div className="profile-hero-bg"></div>
                <div className="profile-avatar-wrap">
                    <div className="profile-avatar" onClick={() => fileInputRef.current.click()}>
                        {avatarUrl
                            ? <img src={avatarUrl} alt="avatar" className="profile-avatar-img" />
                            : <span className="profile-avatar-initials">{getInitials(profile?.name)}</span>
                        }
                        <div className="profile-avatar-overlay">
                            {uploadingPic ? '...' : '📷'}
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePicUpload} />
                    <p className="profile-avatar-hint">Click to change photo</p>
                </div>
                <h1 className="profile-name">{profile?.name}</h1>
                <p className="profile-role-badge">{profile?.role === 'admin' ? '🔑 Administrator' : '👤 Citizen'}</p>
            </div>

            <div className="profile-body">
                {/* Alerts */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">✅ {success}</div>}

                <div className="profile-grid">
                    {/* LEFT — Info + Edit */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <h2>Personal Information</h2>
                            {!editing
                                ? <button className="btn-edit" onClick={() => setEditing(true)}>✏️ Edit</button>
                                : <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                                        {saving ? 'Saving...' : '💾 Save'}
                                    </button>
                                    <button className="btn-cancel" onClick={() => { setEditing(false); setError(''); }}>Cancel</button>
                                  </div>
                            }
                        </div>

                        {editing ? (
                            <div className="profile-form">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                />
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="Phone number"
                                />
                                <label>Address</label>
                                <textarea
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    placeholder="Your address (optional)"
                                    rows={3}
                                />
                            </div>
                        ) : (
                            <div className="profile-info-list">
                                <div className="profile-info-item">
                                    <span className="info-icon">👤</span>
                                    <div>
                                        <p className="info-label">Full Name</p>
                                        <p className="info-value">{profile?.name}</p>
                                    </div>
                                </div>
                                <div className="profile-info-item">
                                    <span className="info-icon">📧</span>
                                    <div>
                                        <p className="info-label">Email Address</p>
                                        <p className="info-value">{profile?.email}</p>
                                    </div>
                                </div>
                                <div className="profile-info-item">
                                    <span className="info-icon">📱</span>
                                    <div>
                                        <p className="info-label">Phone</p>
                                        <p className="info-value">{profile?.phone}</p>
                                    </div>
                                </div>
                                <div className="profile-info-item">
                                    <span className="info-icon">🏠</span>
                                    <div>
                                        <p className="info-label">Address</p>
                                        <p className="info-value">{profile?.address || '—'}</p>
                                    </div>
                                </div>
                                <div className="profile-info-item">
                                    <span className="info-icon">📅</span>
                                    <div>
                                        <p className="info-label">Member Since</p>
                                        <p className="info-value">
                                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Stats + Password */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Stats */}
                        <div className="profile-card">
                            <div className="profile-card-header"><h2>Complaint Statistics</h2></div>
                            <div className="profile-stats-grid">
                                <div className="stat-box stat-total">
                                    <span className="stat-num">{stats.total}</span>
                                    <span className="stat-label">Total</span>
                                </div>
                                <div className="stat-box stat-pending">
                                    <span className="stat-num">{stats.pending}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                                <div className="stat-box stat-investigating">
                                    <span className="stat-num">{stats.investigating}</span>
                                    <span className="stat-label">Investigating</span>
                                </div>
                                <div className="stat-box stat-resolved">
                                    <span className="stat-num">{stats.resolved}</span>
                                    <span className="stat-label">Resolved</span>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="profile-card">
                            <div className="profile-card-header"><h2>🔒 Change Password</h2></div>
                            {pwError && <div className="alert alert-error" style={{ margin: '0 0 12px' }}>{pwError}</div>}
                            {pwSuccess && <div className="alert alert-success" style={{ margin: '0 0 12px' }}>✅ {pwSuccess}</div>}
                            <form className="profile-form" onSubmit={handlePwChange}>
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    placeholder="Current password"
                                    value={pwForm.currentPassword}
                                    onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                    required
                                />
                                <label>New Password</label>
                                <input
                                    type="password"
                                    placeholder="New password (min 6 chars)"
                                    value={pwForm.newPassword}
                                    onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                    required
                                />
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={pwForm.confirmPassword}
                                    onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn-save" style={{ marginTop: '8px' }}>
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
