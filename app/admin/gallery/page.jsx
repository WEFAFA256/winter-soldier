'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('gallery');
    const [images, setImages] = useState([]); // Gallery images
    const [siteContent, setSiteContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Gallery state
    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [altText, setAltText] = useState('');
    const [adding, setAdding] = useState(false);

    // Fetch site data on login
    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const galleryRes = await fetch('/api/gallery');
            const galleryData = await galleryRes.json();
            setImages(galleryData);

            const contentRes = await fetch('/api/content');
            const contentData = await contentRes.json();
            setSiteContent(contentData);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setError('Failed to load site content');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password.trim() === 'Serenityspa256.') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    // Generic Cloudinary image upload helper
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${password}`,
                },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                return data.secure_url;
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to upload image');
                return null;
            }
        } catch (e) {
            alert('Upload error occurred');
            return null;
        }
    };

    // Save site-content.json
    const handleSaveContent = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${password}`,
                },
                body: JSON.stringify(siteContent),
            });
            if (res.ok) {
                alert('Changes saved successfully!');
            } else {
                alert('Failed to save changes');
            }
        } catch (err) {
            alert('Error saving changes');
        } finally {
            setSaving(false);
        }
    };

    // GALLERY OPERATIONS
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

    const handleAddGalleryImage = async (e) => {
        e.preventDefault();
        if (!newImageFile) return;
        setAdding(true);
        const url = await uploadImage(newImageFile);
        if (url) {
            const newImg = {
                id: 'gal-' + Date.now(),
                src: url,
                alt: altText || 'Gallery Image',
                delay: 'delay-100'
            };
            // Add to database/Cloudinary context
            try {
                const res = await fetch('/api/gallery', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${password}`,
                    },
                    body: (() => {
                        const fd = new FormData();
                        fd.append('file', newImageFile);
                        fd.append('alt', altText || 'Gallery Image');
                        return fd;
                    })()
                });
                if (res.ok) {
                    const data = await res.json();
                    setImages([data.image, ...images]);
                    setNewImageFile(null);
                    setImagePreview(null);
                    setAltText('');
                }
            } catch (err) {
                console.error(err);
            }
        }
        setAdding(false);
    };

    const handleRemoveGalleryImage = async (id) => {
        if (!confirm('Are you sure you want to remove this gallery image?')) return;
        try {
            const res = await fetch(`/api/gallery?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${password}`,
                },
            });
            if (res.ok) {
                setImages(images.filter((img) => img.id !== id));
            }
        } catch (err) {
            alert('Failed to delete image');
        }
    };

    // Generic Item Updates for Content Lists (specials, services, rooms, etc.)
    const handleListChange = (section, index, field, value) => {
        const updated = { ...siteContent };
        updated[section][index][field] = value;
        setSiteContent(updated);
    };

    const handleListImageUpload = async (section, index, file, fieldName = 'image') => {
        const url = await uploadImage(file);
        if (url) {
            handleListChange(section, index, fieldName, url);
        }
    };

    const handleAddItem = (section, template) => {
        const updated = { ...siteContent };
        updated[section] = [template, ...updated[section]];
        setSiteContent(updated);
    };

    const handleRemoveItem = (section, index) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const updated = { ...siteContent };
        updated[section] = updated[section].filter((_, i) => i !== index);
        setSiteContent(updated);
    };

    // Nested Text Field updates
    const handleNestedTextChange = (path, value) => {
        const updated = { ...siteContent };
        const keys = path.split('.');
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setSiteContent(updated);
    };

    const handleNestedImageUpload = async (path, file) => {
        const url = await uploadImage(file);
        if (url) {
            handleNestedTextChange(path, url);
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '16px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '32px 24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%', border: '1px solid #334155' }}>
                    <h2 style={{ marginBottom: '8px', textAlign: 'center', color: '#f8fafc', fontSize: '1.8rem', fontWeight: 'bold' }}>Site Admin Dashboard</h2>
                    <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>Authenticate to manipulate texts & images</p>
                    {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Enter Admin Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck="false"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.2s' }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading || !siteContent) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white' }}>
                <p style={{ fontSize: '1.2rem' }}>Loading dynamic site configuration...</p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f1f5f9', paddingTop: '80px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Website Administrator</h1>
                        <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Modify any text or upload new images on the site live</p>
                    </div>
                    <button 
                        onClick={handleSaveContent} 
                        disabled={saving}
                        style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {saving ? 'Saving...' : 'Save All Website Changes'}
                    </button>
                </div>

                {/* Tabs Panel */}
                <div style={{ display: 'flex', borderBottom: '2px solid #334155', marginBottom: '32px', overflowX: 'auto', gap: '12px', paddingBottom: '4px' }}>
                    {[
                        { id: 'gallery', label: '📸 Gallery' },
                        { id: 'homepage', label: '🏠 Homepage Hero' },
                        { id: 'spa', label: '💆 Spa Page' },
                        { id: 'hotel', label: '🏨 Hotel Stays & Specials' },
                        { id: 'services', label: '💅 Spa Services' },
                        { id: 'rooms', label: '🛏️ Hotel Rooms' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 20px',
                                border: 'none',
                                background: 'none',
                                color: activeTab === tab.id ? '#10b981' : '#94a3b8',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                borderBottom: activeTab === tab.id ? '3px solid #10b981' : '3px solid transparent',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area based on Tabs */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
                    
                    {/* TAB 1: GALLERY IMAGES */}
                    {activeTab === 'gallery' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#f8fafc' }}>Gallery Section Images</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Images shown in the main photo gallery section</p>
                            
                            <form onSubmit={handleAddGalleryImage} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#10b981' }}>Add New Image to Gallery</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>Select Image File:</label>
                                        <input type="file" accept="image/*" onChange={handleFileChange} required style={{ color: '#f1f5f9' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>Alt Text (Description):</label>
                                        <input type="text" placeholder="e.g. Aromatherapy room setup" value={altText} onChange={(e) => setAltText(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '6px', overflow: 'hidden' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <button type="submit" disabled={adding || !newImageFile} style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {adding ? 'Uploading...' : 'Upload to Gallery'}
                                </button>
                            </form>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                {images.map((img) => (
                                    <div key={img.id} style={{ backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ position: 'relative', height: '140px' }}>
                                            <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: '0.85rem', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={img.alt}>{img.alt}</p>
                                            <button onClick={() => handleRemoveGalleryImage(img.id)} style={{ width: '100%', padding: '6px', backgroundColor: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: HOMEPAGE HERO */}
                    {activeTab === 'homepage' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#f8fafc' }}>Homepage alternating Hero Slider</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Controls alternating text details and slider background images for Spa vs Hotel stays.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                {/* Spa Content Hero column */}
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <h3 style={{ color: '#00BCD4', margin: '0 0 16px' }}>Spa Hero & Content</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Logo Image:</label>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <img src={siteContent.homepage.spaContent.logo} alt="Spa Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <input type="file" accept="image/*" onChange={(e) => handleNestedImageUpload('homepage.spaContent.logo', e.target.files[0])} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Business Name:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.name} onChange={(e) => handleNestedTextChange('homepage.spaContent.name', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Tagline:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.tagline} onChange={(e) => handleNestedTextChange('homepage.spaContent.tagline', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Location:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.location} onChange={(e) => handleNestedTextChange('homepage.spaContent.location', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>CTA Button Label:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.cta} onChange={(e) => handleNestedTextChange('homepage.spaContent.cta', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>

                                        <div>
                                            <h4 style={{ margin: '12px 0 8px', color: '#94a3b8' }}>Spa Hero Slider Backgrounds</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                                                {siteContent.homepage.spaHeroImages.map((src, idx) => (
                                                    <div key={idx} style={{ position: 'relative', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...siteContent };
                                                                updated.homepage.spaHeroImages = updated.homepage.spaHeroImages.filter((_, i) => i !== idx);
                                                                setSiteContent(updated);
                                                            }}
                                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input type="file" accept="image/*" onChange={async (e) => {
                                                const url = await uploadImage(e.target.files[0]);
                                                if (url) {
                                                    const updated = { ...siteContent };
                                                    updated.homepage.spaHeroImages.push(url);
                                                    setSiteContent(updated);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Hotel Content Hero column */}
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <h3 style={{ color: '#8B4513', margin: '0 0 16px' }}>Hotel Hero & Content</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Logo Image:</label>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <img src={siteContent.homepage.hotelContent.logo} alt="Hotel Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <input type="file" accept="image/*" onChange={(e) => handleNestedImageUpload('homepage.hotelContent.logo', e.target.files[0])} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Business Name:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.name} onChange={(e) => handleNestedTextChange('homepage.hotelContent.name', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Tagline:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.tagline} onChange={(e) => handleNestedTextChange('homepage.hotelContent.tagline', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Location:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.location} onChange={(e) => handleNestedTextChange('homepage.hotelContent.location', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>CTA Button Label:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.cta} onChange={(e) => handleNestedTextChange('homepage.hotelContent.cta', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                        </div>

                                        <div>
                                            <h4 style={{ margin: '12px 0 8px', color: '#94a3b8' }}>Hotel Hero Slider Backgrounds</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                                                {siteContent.homepage.hotelHeroImages.map((src, idx) => (
                                                    <div key={idx} style={{ position: 'relative', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...siteContent };
                                                                updated.homepage.hotelHeroImages = updated.homepage.hotelHeroImages.filter((_, i) => i !== idx);
                                                                setSiteContent(updated);
                                                            }}
                                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input type="file" accept="image/*" onChange={async (e) => {
                                                const url = await uploadImage(e.target.files[0]);
                                                if (url) {
                                                    const updated = { ...siteContent };
                                                    updated.homepage.hotelHeroImages.push(url);
                                                    setSiteContent(updated);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SPA PAGE */}
                    {activeTab === 'spa' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#f8fafc' }}>Spa Main Page</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Manage the slides displayed on the main Spa Page slideshow.</p>

                            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px' }}>
                                <h3 style={{ color: '#00BCD4', margin: '0 0 16px' }}>Spa Hero Slideshow Backgrounds</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                    {siteContent.spaPage.heroImages.map((src, idx) => (
                                        <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155' }}>
                                            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const updated = { ...siteContent };
                                                    updated.spaPage.heroImages = updated.spaPage.heroImages.filter((_, i) => i !== idx);
                                                    setSiteContent(updated);
                                                }}
                                                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Add Slide Image:</label>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    const url = await uploadImage(e.target.files[0]);
                                    if (url) {
                                        const updated = { ...siteContent };
                                        updated.spaPage.heroImages.push(url);
                                        setSiteContent(updated);
                                    }
                                }} />
                            </div>
                        </div>
                    )}

                    {/* TAB 4: HOTEL PAGE & SPECIALS */}
                    {activeTab === 'hotel' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#f8fafc' }}>Hotel Stays Section</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Customize the Hotel slideshow, section descriptions, price flyers, and specials menu items.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {/* Top fields */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Hotel Page Tagline:</label>
                                        <input type="text" value={siteContent.hotelPage.tagline} onChange={(e) => handleNestedTextChange('hotelPage.tagline', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Hotel Location:</label>
                                        <input type="text" value={siteContent.hotelPage.location} onChange={(e) => handleNestedTextChange('hotelPage.location', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Hotel Description:</label>
                                        <textarea rows={3} value={siteContent.hotelPage.description} onChange={(e) => handleNestedTextChange('hotelPage.description', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                                    </div>
                                </div>

                                {/* Slideshow */}
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px' }}>
                                    <h3 style={{ color: '#8B4513', margin: '0 0 16px' }}>Hotel Hero Slideshow Backgrounds</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                        {siteContent.hotelPage.heroImages.map((src, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155' }}>
                                                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = { ...siteContent };
                                                        updated.hotelPage.heroImages = updated.hotelPage.heroImages.filter((_, i) => i !== idx);
                                                        setSiteContent(updated);
                                                    }}
                                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Add Slide Image:</label>
                                    <input type="file" accept="image/*" onChange={async (e) => {
                                        const url = await uploadImage(e.target.files[0]);
                                        if (url) {
                                            const updated = { ...siteContent };
                                            updated.hotelPage.heroImages.push(url);
                                            setSiteContent(updated);
                                        }
                                    }} />
                                </div>

                                {/* Hotel Price List Slideshow */}
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px' }}>
                                    <h3 style={{ color: '#8B4513', margin: '0 0 16px' }}>Hotel Price List Flyers</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                        {siteContent.hotelPriceList.images.map((src, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155' }}>
                                                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = { ...siteContent };
                                                        updated.hotelPriceList.images = updated.hotelPriceList.images.filter((_, i) => i !== idx);
                                                        setSiteContent(updated);
                                                    }}
                                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Add Price List Flyer:</label>
                                    <input type="file" accept="image/*" onChange={async (e) => {
                                        const url = await uploadImage(e.target.files[0]);
                                        if (url) {
                                            const updated = { ...siteContent };
                                            updated.hotelPriceList.images.push(url);
                                            setSiteContent(updated);
                                        }
                                    }} />
                                </div>

                                {/* Hotel Specials List */}
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ color: '#C5A059', margin: 0 }}>Café & Bar Specials</h3>
                                        <button 
                                            onClick={() => handleAddItem('hotelPage.specials', { title: 'New Special', desc: 'Description here', image: '/assets/hotel_specials/nojito_closeup.jpg' })}
                                            style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            + Add New Special
                                        </button>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {siteContent.hotelPage.specials.map((special, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '20px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                                    <img src={special.image} alt={special.title} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('hotelPage.specials', idx, e.target.files[0], 'image')} />
                                                </div>
                                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <input type="text" value={special.title} onChange={(e) => handleListChange('hotelPage.specials', idx, 'title', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #475569', color: 'white', fontWeight: 'bold' }} />
                                                    <textarea rows={2} value={special.desc} onChange={(e) => handleListChange('hotelPage.specials', idx, 'desc', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #475569', color: 'white', fontFamily: 'inherit' }} />
                                                </div>
                                                <button onClick={() => handleRemoveItem('hotelPage.specials', idx)} style={{ alignSelf: 'flex-start', padding: '8px 12px', backgroundColor: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: SPA SERVICES */}
                    {activeTab === 'services' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#f8fafc' }}>Spa Service Catalog</h2>
                                    <p style={{ color: '#94a3b8', margin: 0 }}>Add, edit, or remove services from the pricing tiers.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddItem('services', { title: 'New Spa Treatment', price: 150000, description: 'Enter service details', image: '/assets/service1.jpg', fullImage: '/assets/swedish-massage-full.jpg', delay: 'delay-100' })}
                                    style={{ padding: '10px 20px', backgroundColor: '#10b981', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    + Add New Service
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {siteContent.services.map((service, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '20px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#94a3b8' }}>Grid Card:</p>
                                                    <img src={service.image} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('services', idx, e.target.files[0], 'image')} style={{ width: '80px', fontSize: '0.7rem' }} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#94a3b8' }}>Detail Modal:</p>
                                                    <img src={service.fullImage} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('services', idx, e.target.files[0], 'fullImage')} style={{ width: '80px', fontSize: '0.7rem' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', minWidth: '250px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Service Title:</label>
                                                <input type="text" value={service.title} onChange={(e) => handleListChange('services', idx, 'title', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white', fontWeight: 'bold' }} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Price (UGX):</label>
                                                <input type="number" value={service.price} onChange={(e) => handleListChange('services', idx, 'price', parseInt(e.target.value) || 0)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                            </div>
                                            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Description:</label>
                                                <textarea rows={2} value={service.description} onChange={(e) => handleListChange('services', idx, 'description', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white', fontFamily: 'inherit' }} />
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveItem('services', idx)} style={{ alignSelf: 'center', padding: '10px 16px', backgroundColor: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 6: HOTEL ROOMS */}
                    {activeTab === 'rooms' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#f8fafc' }}>Hotel Rooms & Suites Catalog</h2>
                                    <p style={{ color: '#94a3b8', margin: 0 }}>Configure available room designs, rates, and specifications.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddItem('rooms', { title: 'New Executive Room', price: '120$ / UGX 420K', description: 'Room layout features & pricing details.', image: '/assets/hotel_rooms/economy_stay.jpg', delay: 'delay-100' })}
                                    style={{ padding: '10px 20px', backgroundColor: '#10b981', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    + Add New Room
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {siteContent.rooms.map((room, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '20px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                            <img src={room.image} alt={room.title} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                                            <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('rooms', idx, e.target.files[0], 'image')} />
                                        </div>
                                        <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', minWidth: '250px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Room Name:</label>
                                                <input type="text" value={room.title} onChange={(e) => handleListChange('rooms', idx, 'title', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white', fontWeight: 'bold' }} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Price Label (e.g. 100$ / UGX 350K):</label>
                                                <input type="text" value={room.price} onChange={(e) => handleListChange('rooms', idx, 'price', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' }} />
                                            </div>
                                            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Description details:</label>
                                                <textarea rows={2} value={room.description} onChange={(e) => handleListChange('rooms', idx, 'description', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white', fontFamily: 'inherit' }} />
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveItem('rooms', idx)} style={{ alignSelf: 'center', padding: '10px 16px', backgroundColor: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
