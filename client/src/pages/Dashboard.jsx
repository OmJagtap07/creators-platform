import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// ── Static placeholder data ───────────────────────────────────
const stats = [
    { label: 'Posts Published', value: '12', icon: '📝' },
    { label: 'Total Views', value: '4,821', icon: '👁️' },
    { label: 'Followers', value: '238', icon: '👥' },
    { label: 'Drafts', value: '3', icon: '📂' },
];

const recentPosts = [
    { id: 1, title: 'My Journey into Open Source', date: 'Feb 21, 2025', views: 312, status: 'Published' },
    { id: 2, title: 'Understanding Async/Await in JS', date: 'Feb 17, 2025', views: 891, status: 'Published' },
    { id: 3, title: 'Why I Switched to TypeScript', date: 'Feb 10, 2025', views: 1203, status: 'Published' },
    { id: 4, title: 'Web Accessibility Fundamentals', date: '—', views: 0, status: 'Draft' },
];

function Dashboard() {
    const { user, logout, loading } = useAuth();

    // Wait for AuthProvider to finish reading localStorage
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                Loading…
            </div>
        );
    }

    // Redirect if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="dashboard">
            <div className="dashboard-inner">

                {/* Welcome header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {user.name} 👋</h1>
                        <p className="dashboard-subtitle">Here&apos;s what&apos;s happening with your blog</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="#" className="btn btn-primary">+ New Post</Link>
                        <button
                            onClick={logout}
                            className="btn btn-logout"
                            style={{
                                padding: '0.55rem 1.2rem',
                                backgroundColor: 'transparent',
                                border: '1px solid #475569',
                                borderRadius: '8px',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* User info card */}
                <div style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '1.5rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    gap: '2.5rem',
                    flexWrap: 'wrap',
                }}>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</span>
                        <p style={{ color: '#f1f5f9', fontWeight: '600', marginTop: '0.2rem' }}>{user.name}</p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                        <p style={{ color: '#f1f5f9', fontWeight: '600', marginTop: '0.2rem' }}>{user.email}</p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</span>
                        <p style={{ color: '#f1f5f9', fontWeight: '600', marginTop: '0.2rem' }}>
                            {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.label} className="stat-card">
                            <span className="stat-icon">{stat.icon}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Recent Posts Table */}
                <div className="recent-section">
                    <h2 className="section-heading">Recent Posts</h2>
                    <div className="table-wrapper">
                        <table className="posts-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Views</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPosts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="post-title-cell">{post.title}</td>
                                        <td>{post.date}</td>
                                        <td>{post.views > 0 ? post.views.toLocaleString() : '—'}</td>
                                        <td>
                                            <span className={`status-badge ${post.status.toLowerCase()}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Dashboard;
