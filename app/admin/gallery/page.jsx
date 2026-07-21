'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminGalleryPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [altText, setAltText] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchGallery();
        }
    }, [isAuthenticated]);

    const fetchGallery = async () => {
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            setImages(data);
        } catch (err) {
            console.error('Failed to fetch gallery', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Trim whitespace to prevent mobile keyboard trailing space issues
        if (password.trim() === 'Serenityspa256.') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageFile) {
            setError('Please select an image first');
            return;
        }

        setAdding(true);
        setError('');
        
        const formData = new FormData();
        formData.append('file', newImageFile);
        formData.append('alt', altText);

        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${password}`,
                },
                body: formData,
            });
            
            if (res.ok) {
                const added = await res.json();
                setImages([added.image, ...images]);
                setNewImageFile(null);
                setImagePreview(null);
                setAltText('');
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to add image');
            }
        } catch (err) {
            setError('An error occurred while adding the image.');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveImage = async (id) => {
        if (!confirm('Are you sure you want to remove this image?')) return;
        
        try {
            const res = await fetch(`/api/gallery?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${password}`,
                },
            });
            if (res.ok) {
                setImages(images.filter((img) => img.id !== id));
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to remove image');
            }
        } catch (err) {
            alert('Failed to delete image');
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '16px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', boxSizing: 'border-box' }}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333', fontSize: '1.5rem' }}>Admin Login</h2>
                    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '0.9rem' }}>Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck="false"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 16px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.8rem', color: '#333' }}>Gallery Admin</h1>
            
            <div style={{ backgroundColor: 'white', padding: '20px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px', boxSizing: 'border-box' }}>
                <h2 style={{ marginBottom: '16px', fontSize: '1.3rem', color: '#444' }}>Add New Image from Device</h2>
                {error && <p style={{ color: 'red', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
                
                <form onSubmit={handleAddImage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                        <div style={{ width: '100%' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: '500', fontSize: '0.9rem' }}>Select Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', background: '#f9f9f9', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: '500', fontSize: '0.9rem' }}>Description (Alt Text):</label>
                            <input
                                type="text"
                                placeholder="e.g. Massage Therapy Session"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>

                    {imagePreview && (
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ marginBottom: '8px', color: '#666', fontWeight: '500', fontSize: '0.9rem' }}>Preview:</p>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '240px', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #eee' }}>
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={adding || !newImageFile}
                        style={{ width: '100%', padding: '14px', backgroundColor: (adding || !newImageFile) ? '#ccc' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: (adding || !newImageFile) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s' }}
                    >
                        {adding ? 'Uploading...' : 'Upload & Add to Gallery'}
                    </button>
                </form>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading gallery...</p>
            ) : (
                <div>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.3rem', color: '#444' }}>Current Images ({images.length})</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                        {images.map((img) => (
                            <div key={img.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative', height: '150px', width: '100%' }}>
                                    <Image 
                                        src={img.src} 
                                        alt={img.alt}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                                    <p style={{ margin: 0, fontWeight: '500', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }} title={img.alt}>
                                        {img.alt}
                                    </p>
                                    <button 
                                        onClick={() => handleRemoveImage(img.id)}
                                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', width: '100%', fontWeight: '500' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
