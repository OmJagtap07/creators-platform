import { Link } from 'react-router-dom';
import './Home.css';

const featuredPosts = [
    {
        id: 1,
        title: 'Getting Started with React in 2025',
        excerpt: 'A comprehensive guide for beginners diving into the React ecosystem, covering hooks, routing, and state management.',
        author: 'Alex Rivera',
        date: 'Feb 20, 2025',
        tag: 'React',
    },
    {
        id: 2,
        title: 'Building RESTful APIs with Node.js',
        excerpt: 'Learn how to design and implement scalable REST APIs using Express, MongoDB, and best practices.',
        author: 'Priya Sharma',
        date: 'Feb 18, 2025',
        tag: 'Node.js',
    },
    {
        id: 3,
        title: 'The Art of Clean Code',
        excerpt: 'Principles and practices that every developer should follow to write maintainable, readable code.',
        author: 'Sam Chen',
        date: 'Feb 15, 2025',
        tag: 'Best Practices',
    },
];

function Home() {
    return (
        <main className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-inner">
                    <span className="hero-badge">✍️ A Platform for Creators</span>
                    <h1 className="hero-title">
                        Write. Share. <span className="gradient-text">Inspire.</span>
                    </h1>
                    <p className="hero-subtitle">
                        CreatorHub is the home for passionate writers and developers. Publish
                        your ideas, grow your audience, and connect with a community that cares
                        about quality content.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary">Start Writing Free</Link>
                        <Link to="/login" className="btn btn-secondary">Sign In</Link>
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            <section className="featured">
                <div className="section-inner">
                    <h2 className="section-title">Featured Posts</h2>
                    <p className="section-subtitle">Handpicked articles from our top creators</p>
                    <div className="posts-grid">
                        {featuredPosts.map((post) => (
                            <article key={post.id} className="post-card">
                                <span className="post-tag">{post.tag}</span>
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-excerpt">{post.excerpt}</p>
                                <div className="post-meta">
                                    <span className="post-author">👤 {post.author}</span>
                                    <span className="post-date">{post.date}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-inner">
                    <h2>Ready to share your story?</h2>
                    <p>Join thousands of creators publishing on CreatorHub today.</p>
                    <Link to="/register" className="btn btn-primary">Create Your Account</Link>
                </div>
            </section>
        </main>
    );
}

export default Home;
