'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function SpaBlogDetailPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                if (data && data.blogs) {
                    const found = data.blogs.find(b => b.slug === slug);
                    setPost(found || null);
                }
            } catch (err) {
                console.error("Failed to fetch blog post content", err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) {
            fetchBlogPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div style={{ backgroundColor: '#f0faf9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#00BCD4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ backgroundColor: '#f0faf9', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
                <h1 style={{ fontFamily: '"Times New Roman", Times, serif', color: 'var(--color-primary)', marginBottom: '1rem' }}>Article Not Found</h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>The blog post you are looking for does not exist or has been removed.</p>
                <Link href="/spa/blog" className="btn" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '50px' }}>
                    Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f0faf9', minHeight: '100vh', padding: '120px 0 80px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                
                {/* Back to Blog */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/spa/blog" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Back to Blog
                    </Link>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                        <Image 
                            src={post.coverImage} 
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                )}

                {/* Header */}
                <header style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: '500' }}>
                        <span>📅 {post.date}</span>
                        <span>⏱️ {post.readTime}</span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        lineHeight: '1.2',
                        fontFamily: '"Times New Roman", Times, serif',
                        color: 'var(--color-primary)',
                        margin: 0
                    }}>
                        {post.title}
                    </h1>
                </header>

                <hr style={{ border: 0, borderTop: '1px solid #cbd5e1', marginBottom: '2.5rem' }} />

                {/* Content Blocks */}
                <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {(post.content || []).map((block, index) => {
                        if (block.type === 'paragraph') {
                            return (
                                <p 
                                    key={index} 
                                    style={{ 
                                        color: '#334155', 
                                        fontSize: '1.125rem', 
                                        lineHeight: '1.8', 
                                        margin: 0 
                                    }}
                                >
                                    {block.text}
                                </p>
                            );
                        } else if (block.type === 'heading') {
                            return (
                                <h2 
                                    key={index} 
                                    style={{ 
                                        fontSize: '1.75rem', 
                                        fontFamily: '"Times New Roman", Times, serif', 
                                        color: 'var(--color-primary)', 
                                        marginTop: '1.5rem', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: '700' 
                                    }}
                                >
                                    {block.text}
                                </h2>
                            );
                        } else if (block.type === 'image') {
                            return (
                                <figure key={index} style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                        <img 
                                            src={block.url || '/assets/service1.jpg'} 
                                            alt={block.caption || 'Blog illustration'} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    {block.caption && (
                                        <figcaption style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem', color: '#64748b' }}>
                                            {block.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            );
                        }
                        return null;
                    })}
                </article>
            </div>
        </div>
    );
}
