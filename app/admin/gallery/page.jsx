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
        // Simple client side check, we will also verify headers on API request
        if (password === 'Serenityspa256.') {
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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Admin Login</h2>
                    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', color: '#333' }}>Gallery Admin</h1>
            
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#444' }}>Add New Image from Device</h2>
                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                
                <form onSubmit={handleAddImage} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: '500' }}>Select Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', background: '#f9f9f9' }}
                                required
                            />
                        </div>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: '500' }}>Description (Alt Text):</label>
                            <input
                                type="text"
                                placeholder="e.g. Massage Therapy Session"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    {imagePreview && (
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ marginBottom: '8px', color: '#666', fontWeight: '500' }}>Preview:</p>
                            <div style={{ position: 'relative', width: '200px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #eee' }}>
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={adding || !newImageFile}
                        style={{ alignSelf: 'flex-start', padding: '12px 40px', backgroundColor: (adding || !newImageFile) ? '#ccc' : '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: (adding || !newImageFile) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s' }}
                    >
                        {adding ? 'Uploading...' : 'Upload & Add to Gallery'}
                    </button>
                </form>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading gallery...</p>
            ) : (
                <div>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#444' }}>Current Images ({images.length})</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {images.map((img) => (
                            <div key={img.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                                    <Image 
                                        src={img.src} 
                                        alt={img.alt}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ margin: 0, fontWeight: '500', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }} title={img.alt}>
                                        {img.alt}
                                    </p>
                                    <button 
                                        onClick={() => handleRemoveImage(img.id)}
                                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
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
