import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line,
} from 'recharts';
import api from '../../services/api';

const STATUS_COLORS = {
    Pending: '#f59e0b',
    'Under Investigation': '#3b82f6',
    Resolved: '#10b981',
};

const CATEGORY_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const StatCard = ({ label, value, icon, color }) => (
    <div className="analytics-stat-card" style={{ borderTop: `4px solid ${color}` }}>
        <span className="analytics-stat-icon">{icon}</span>
        <div>
            <p className="analytics-stat-value">{value}</p>
            <p className="analytics-stat-label">{label}</p>
        </div>
    </div>
);

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/complaints/analytics')
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load analytics'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="profile-loading">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
        </div>
    );

    if (error) return <div className="alert alert-error" style={{ margin: '32px auto', maxWidth: '500px' }}>{error}</div>;

    const pending = data.byStatus.find(s => s.name === 'Pending')?.value || 0;
    const investigating = data.byStatus.find(s => s.name === 'Under Investigation')?.value || 0;
    const resolved = data.byStatus.find(s => s.name === 'Resolved')?.value || 0;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px' }}>
                    <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>{payload[0].name}</p>
                    <p style={{ color: '#f1f5f9', fontWeight: 700, margin: '4px 0 0', fontSize: 16 }}>{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics-page">
            {/* Header */}
            <div className="analytics-header">
                <h1>📊 Analytics Dashboard</h1>
                <p>Real-time insights into complaint data</p>
            </div>

            {/* Stat Cards */}
            <div className="analytics-stats-grid">
                <StatCard label="Total Complaints" value={data.total} icon="📋" color="#6366f1" />
                <StatCard label="Pending" value={pending} icon="⏳" color="#f59e0b" />
                <StatCard label="Under Investigation" value={investigating} icon="🔍" color="#3b82f6" />
                <StatCard label="Resolved" value={resolved} icon="✅" color="#10b981" />
            </div>

            {/* Charts Grid */}
            <div className="analytics-charts-grid">
                {/* Pie Chart — Status */}
                <div className="analytics-chart-card">
                    <h2 className="chart-title">Complaints by Status</h2>
                    {data.byStatus.length === 0
                        ? <p className="chart-empty">No data available</p>
                        : (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={data.byStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        innerRadius={45}
                                        paddingAngle={3}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {data.byStatus.map((entry) => (
                                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        formatter={(value) => <span style={{ color: '#cbd5e1', fontSize: 13 }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )
                    }
                </div>

                {/* Bar Chart — Category */}
                <div className="analytics-chart-card">
                    <h2 className="chart-title">Complaints by Category</h2>
                    {data.byCategory.length === 0
                        ? <p className="chart-empty">No data available</p>
                        : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={data.byCategory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.1)' }} />
                                    <Bar dataKey="value" name="Complaints" radius={[6, 6, 0, 0]}>
                                        {data.byCategory.map((entry, index) => (
                                            <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    }
                </div>

                {/* Line Chart — Monthly */}
                <div className="analytics-chart-card analytics-chart-full">
                    <h2 className="chart-title">Monthly Complaints (Last 6 Months)</h2>
                    {data.byMonth.length === 0
                        ? <p className="chart-empty">No data available for the last 6 months</p>
                        : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={data.byMonth} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        name="Complaints"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ fill: '#6366f1', r: 6, strokeWidth: 2, stroke: '#1e293b' }}
                                        activeDot={{ r: 8, fill: '#818cf8' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
