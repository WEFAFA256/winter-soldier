'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollReveal } from '../../../src/hooks/useAnimations';

export default function SpaBlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                if (data && data.blogs) {
                    setBlogs(data.blogs);
                }
            } catch (err) {
                console.error("Failed to fetch blog list content", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    useScrollReveal();

    return (
        <div style={{ backgroundColor: '#f0faf9', minHeight: '100vh', padding: '120px 0 60px' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ 
                        color: 'var(--color-primary)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '2px', 
                        fontSize: '0.9rem', 
                        fontWeight: '600' 
                    }}>
                        Wellness & Self-Care Insights
                    </span>
                    <h1 style={{
                        fontSize: '3rem',
                        marginTop: '0.5rem',
                        marginBottom: '1rem',
                        fontFamily: '"Times New Roman", Times, serif',
                        color: 'var(--color-primary)'
                    }}>
                        The Serenity Blog
                    </h1>
                    <p style={{
                        color: 'var(--color-text-light)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Explore guides, self-care routines, and updates from our relaxation sanctuary.
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#00BCD4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : blogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <h3>No articles published yet.</h3>
                        <p style={{ color: '#666' }}>Check back soon for insights on spa treatments and wellness.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {blogs.map((post, index) => (
                            <article
                                key={post.id || index}
                                className={`scroll-reveal-float hover-lift delay-${(index % 3 + 1) * 100}`}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Link href={`/spa/blog/${post.slug}`} style={{ position: 'relative', height: '220px', display: 'block', overflow: 'hidden' }}>
                                    <Image 
                                        src={post.coverImage || '/assets/service1.jpg'} 
                                        alt={post.title}
                                        fill
                                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </Link>

                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.8rem', fontWeight: '500' }}>
                                        <span>📅 {post.date}</span>
                                        <span>⏱️ {post.readTime}</span>
                                    </div>

                                    <h2 style={{ 
                                        fontSize: '1.4rem', 
                                        margin: '0 0 1rem', 
                                        color: 'var(--color-primary)', 
                                        fontFamily: '"Times New Roman", Times, serif',
                                        lineHeight: '1.4'
                                    }}>
                                        <Link href={`/spa/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p style={{ 
                                        color: 'var(--color-text-light)', 
                                        fontSize: '0.95rem', 
                                        lineHeight: '1.6',
                                        margin: '0 0 1.5rem',
                                        flexGrow: 1
                                    }}>
                                        {post.excerpt}
                                    </p>

                                    <Link 
                                        href={`/spa/blog/${post.slug}`}
                                        className="btn"
                                        style={{ 
                                            alignSelf: 'flex-start',
                                            textDecoration: 'none',
                                            padding: '0.6rem 1.5rem',
                                            fontSize: '0.9rem',
                                            borderRadius: '50px',
                                            display: 'inline-block',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Read Article
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
