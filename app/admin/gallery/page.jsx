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
        const trimmedPassword = password.trim();
        if (trimmedPassword === 'Serenityspa256.') {
            setPassword(trimmedPassword);
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
                    'Authorization': `Bearer ${password.trim()}`,
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
                    'Authorization': `Bearer ${password.trim()}`,
                },
                body: JSON.stringify(siteContent),
            });
            if (res.ok) {
                alert('Changes saved successfully!');
            } else {
                let errMsg = 'Failed to save changes';
                try {
                    const data = await res.json();
                    errMsg = data.error || errMsg;
                } catch (e) {
                    console.error("Failed to parse error response", e);
                }
                console.error("Save failed with status:", res.status, errMsg);
                alert(`Failed to save changes: ${errMsg}`);
            }
        } catch (err) {
            console.error("Error during save content API call:", err);
            alert(`Error saving changes: ${err.message || err}`);
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
            try {
                const res = await fetch('/api/gallery', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${password.trim()}`,
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
                    'Authorization': `Bearer ${password.trim()}`,
                },
            });
            if (res.ok) {
                setImages(images.filter((img) => img.id !== id));
            }
        } catch (err) {
            alert('Failed to delete image');
        }
    };

    // Generic Item Updates for Content Lists
    const handleListChange = (section, index, field, value) => {
        const updated = { ...siteContent };
        updated[section][index][field] = value;
        setSiteContent(updated);
    };

    const handleListImageUpload = async (section, index, file, fieldName = 'image') => {
        if (!file) return;
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
        if (!file) return;
        const url = await uploadImage(file);
        if (url) {
            handleNestedTextChange(path, url);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '32px 24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', maxWidth: '420px', width: '100%', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.75rem', fontWeight: '800' }}>Admin Dashboard</h2>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Enter password to manage website texts & images</p>
                    </div>
                    {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label className="admin-label">Admin Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck="false"
                                className="admin-input"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button type="submit" className="admin-save-btn admin-full-mobile" style={{ width: '100%' }}>
                            Authenticate & Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading || !siteContent) {
        return (
            <div className="admin-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                    <p style={{ fontSize: '1.1rem', color: '#334155', fontWeight: '600' }}>Loading dynamic site configuration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-wrapper">
            <div className="admin-container">
                
                {/* Header */}
                <div className="admin-header">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>Website Control Center</h1>
                        <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.95rem' }}>Modify live website content, descriptions, catalog services, and images</p>
                    </div>
                    <button 
                        onClick={handleSaveContent} 
                        disabled={saving}
                        className="admin-save-btn"
                    >
                        {saving ? '💾 Saving Changes...' : '💾 Save All Website Changes'}
                    </button>
                </div>

                {/* Tabs Panel */}
                <div className="admin-tabs-nav">
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
                            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area based on Tabs */}
                <div className="admin-card">
                    
                    {/* TAB 1: GALLERY IMAGES */}
                    {activeTab === 'gallery' && (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#0f172a' }}>Gallery Section Images</h2>
                                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Manage photos displayed in the public gallery view.</p>
                            </div>
                            
                            <form onSubmit={handleAddGalleryImage} className="admin-subcard" style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#059669', fontWeight: '700' }}>+ Add New Image to Gallery</h3>
                                <div className="admin-grid-2">
                                    <div>
                                        <label className="admin-label">Select Image File:</label>
                                        <input type="file" accept="image/*" onChange={handleFileChange} required className="admin-file-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Alt Text (Description):</label>
                                        <input type="text" placeholder="e.g. Aromatherapy room setup" value={altText} onChange={(e) => setAltText(e.target.value)} required className="admin-input" />
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <button type="submit" disabled={adding || !newImageFile} className="admin-btn-primary admin-full-mobile" style={{ alignSelf: 'flex-start' }}>
                                    {adding ? 'Uploading...' : 'Upload to Gallery'}
                                </button>
                            </form>

                            <div className="admin-gallery-grid">
                                {images.map((img) => (
                                    <div key={img.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ position: 'relative', height: '130px' }}>
                                            <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: '0.85rem', margin: 0, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '500' }} title={img.alt}>{img.alt}</p>
                                            <button onClick={() => handleRemoveGalleryImage(img.id)} className="admin-delete-btn">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: HOMEPAGE HERO */}
                    {activeTab === 'homepage' && (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#0f172a' }}>Homepage Hero Section</h2>
                                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Customize headlines, text details, and hero slider background images for Spa vs Hotel stays.</p>
                            </div>

                            <div className="admin-grid-2">
                                {/* Spa Content Hero column */}
                                <div className="admin-subcard">
                                    <h3 style={{ color: '#0284c7', margin: '0 0 16px', fontSize: '1.1rem', fontWeight: '700' }}>💆 Spa Hero & Details</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label className="admin-label">Logo Image:</label>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <img src={siteContent.homepage.spaContent.logo} alt="Spa Logo" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                                                <input type="file" accept="image/*" onChange={(e) => handleNestedImageUpload('homepage.spaContent.logo', e.target.files[0])} className="admin-file-input" style={{ flex: 1, minWidth: '180px' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="admin-label">Business Name:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.name} onChange={(e) => handleNestedTextChange('homepage.spaContent.name', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">Tagline:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.tagline} onChange={(e) => handleNestedTextChange('homepage.spaContent.tagline', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">Location:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.location} onChange={(e) => handleNestedTextChange('homepage.spaContent.location', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">CTA Button Label:</label>
                                            <input type="text" value={siteContent.homepage.spaContent.cta} onChange={(e) => handleNestedTextChange('homepage.spaContent.cta', e.target.value)} className="admin-input" />
                                        </div>

                                        <div>
                                            <label className="admin-label" style={{ marginTop: '8px' }}>Spa Hero Slider Backgrounds:</label>
                                            <div className="admin-thumb-grid" style={{ marginBottom: '12px' }}>
                                                {siteContent.homepage.spaHeroImages.map((src, idx) => (
                                                    <div key={idx} style={{ position: 'relative', height: '64px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...siteContent };
                                                                updated.homepage.spaHeroImages = updated.homepage.spaHeroImages.filter((_, i) => i !== idx);
                                                                setSiteContent(updated);
                                                            }}
                                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input type="file" accept="image/*" onChange={async (e) => {
                                                if (!e.target.files[0]) return;
                                                const url = await uploadImage(e.target.files[0]);
                                                if (url) {
                                                    const updated = { ...siteContent };
                                                    updated.homepage.spaHeroImages.push(url);
                                                    setSiteContent(updated);
                                                }
                                            }} className="admin-file-input" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hotel Content Hero column */}
                                <div className="admin-subcard">
                                    <h3 style={{ color: '#9a3412', margin: '0 0 16px', fontSize: '1.1rem', fontWeight: '700' }}>🏨 Hotel Hero & Details</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label className="admin-label">Logo Image:</label>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <img src={siteContent.homepage.hotelContent.logo} alt="Hotel Logo" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                                                <input type="file" accept="image/*" onChange={(e) => handleNestedImageUpload('homepage.hotelContent.logo', e.target.files[0])} className="admin-file-input" style={{ flex: 1, minWidth: '180px' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="admin-label">Business Name:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.name} onChange={(e) => handleNestedTextChange('homepage.hotelContent.name', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">Tagline:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.tagline} onChange={(e) => handleNestedTextChange('homepage.hotelContent.tagline', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">Location:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.location} onChange={(e) => handleNestedTextChange('homepage.hotelContent.location', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">CTA Button Label:</label>
                                            <input type="text" value={siteContent.homepage.hotelContent.cta} onChange={(e) => handleNestedTextChange('homepage.hotelContent.cta', e.target.value)} className="admin-input" />
                                        </div>

                                        <div>
                                            <label className="admin-label" style={{ marginTop: '8px' }}>Hotel Hero Slider Backgrounds:</label>
                                            <div className="admin-thumb-grid" style={{ marginBottom: '12px' }}>
                                                {siteContent.homepage.hotelHeroImages.map((src, idx) => (
                                                    <div key={idx} style={{ position: 'relative', height: '64px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...siteContent };
                                                                updated.homepage.hotelHeroImages = updated.homepage.hotelHeroImages.filter((_, i) => i !== idx);
                                                                setSiteContent(updated);
                                                            }}
                                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input type="file" accept="image/*" onChange={async (e) => {
                                                if (!e.target.files[0]) return;
                                                const url = await uploadImage(e.target.files[0]);
                                                if (url) {
                                                    const updated = { ...siteContent };
                                                    updated.homepage.hotelHeroImages.push(url);
                                                    setSiteContent(updated);
                                                }
                                            }} className="admin-file-input" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SPA PAGE */}
                    {activeTab === 'spa' && (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#0f172a' }}>Spa Main Page</h2>
                                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Manage the slides displayed on the main Spa Page slideshow.</p>
                            </div>

                            <div className="admin-subcard">
                                <h3 style={{ color: '#0284c7', margin: '0 0 16px', fontSize: '1.1rem', fontWeight: '700' }}>Spa Hero Slideshow Backgrounds</h3>
                                <div className="admin-gallery-grid" style={{ marginBottom: '20px' }}>
                                    {siteContent.spaPage.heroImages.map((src, idx) => (
                                        <div key={idx} style={{ position: 'relative', height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const updated = { ...siteContent };
                                                    updated.spaPage.heroImages = updated.spaPage.heroImages.filter((_, i) => i !== idx);
                                                    setSiteContent(updated);
                                                }}
                                                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label className="admin-label">Add Slide Image:</label>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    if (!e.target.files[0]) return;
                                    const url = await uploadImage(e.target.files[0]);
                                    if (url) {
                                        const updated = { ...siteContent };
                                        updated.spaPage.heroImages.push(url);
                                        setSiteContent(updated);
                                    }
                                }} className="admin-file-input" />
                            </div>
                        </div>
                    )}

                    {/* TAB 4: HOTEL PAGE & SPECIALS */}
                    {activeTab === 'hotel' && (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#0f172a' }}>Hotel Stays Section</h2>
                                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Customize the Hotel slideshow, section descriptions, price flyers, and specials menu items.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Top fields */}
                                <div className="admin-subcard">
                                    <h3 style={{ margin: '0 0 16px', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>General Hotel Details</h3>
                                    <div className="admin-grid-2">
                                        <div>
                                            <label className="admin-label">Hotel Page Tagline:</label>
                                            <input type="text" value={siteContent.hotelPage.tagline} onChange={(e) => handleNestedTextChange('hotelPage.tagline', e.target.value)} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="admin-label">Hotel Location:</label>
                                            <input type="text" value={siteContent.hotelPage.location} onChange={(e) => handleNestedTextChange('hotelPage.location', e.target.value)} className="admin-input" />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="admin-label">Hotel Description:</label>
                                            <textarea rows={3} value={siteContent.hotelPage.description} onChange={(e) => handleNestedTextChange('hotelPage.description', e.target.value)} className="admin-textarea" />
                                        </div>
                                    </div>
                                </div>

                                {/* Slideshow */}
                                <div className="admin-subcard">
                                    <h3 style={{ color: '#9a3412', margin: '0 0 16px', fontSize: '1.1rem', fontWeight: '700' }}>Hotel Hero Slideshow Backgrounds</h3>
                                    <div className="admin-gallery-grid" style={{ marginBottom: '20px' }}>
                                        {siteContent.hotelPage.heroImages.map((src, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = { ...siteContent };
                                                        updated.hotelPage.heroImages = updated.hotelPage.heroImages.filter((_, i) => i !== idx);
                                                        setSiteContent(updated);
                                                    }}
                                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <label className="admin-label">Add Slide Image:</label>
                                    <input type="file" accept="image/*" onChange={async (e) => {
                                        if (!e.target.files[0]) return;
                                        const url = await uploadImage(e.target.files[0]);
                                        if (url) {
                                            const updated = { ...siteContent };
                                            updated.hotelPage.heroImages.push(url);
                                            setSiteContent(updated);
                                        }
                                    }} className="admin-file-input" />
                                </div>

                                {/* Hotel Price List Slideshow */}
                                <div className="admin-subcard">
                                    <h3 style={{ color: '#9a3412', margin: '0 0 16px', fontSize: '1.1rem', fontWeight: '700' }}>Hotel Price List Flyers</h3>
                                    <div className="admin-gallery-grid" style={{ marginBottom: '20px' }}>
                                        {siteContent.hotelPriceList.images.map((src, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = { ...siteContent };
                                                        updated.hotelPriceList.images = updated.hotelPriceList.images.filter((_, i) => i !== idx);
                                                        setSiteContent(updated);
                                                    }}
                                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <label className="admin-label">Add Price List Flyer:</label>
                                    <input type="file" accept="image/*" onChange={async (e) => {
                                        if (!e.target.files[0]) return;
                                        const url = await uploadImage(e.target.files[0]);
                                        if (url) {
                                            const updated = { ...siteContent };
                                            updated.hotelPriceList.images.push(url);
                                            setSiteContent(updated);
                                        }
                                    }} className="admin-file-input" />
                                </div>

                                {/* Hotel Specials List */}
                                <div className="admin-subcard">
                                    <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#b45309', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>🍹 Café & Bar Specials</h3>
                                        <button 
                                            onClick={() => handleAddItem('hotelPage.specials', { title: 'New Special', desc: 'Description here', image: '/assets/hotel_specials/nojito_closeup.jpg' })}
                                            className="admin-btn-primary admin-full-mobile"
                                        >
                                            + Add New Special
                                        </button>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {siteContent.hotelPage.specials.map((special, idx) => (
                                            <div key={idx} className="admin-item-card">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%', maxWidth: '140px' }}>
                                                    <img src={special.image} alt={special.title} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('hotelPage.specials', idx, e.target.files[0], 'image')} className="admin-file-input" style={{ fontSize: '0.75rem' }} />
                                                </div>
                                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
                                                    <div>
                                                        <label className="admin-label">Title:</label>
                                                        <input type="text" value={special.title} onChange={(e) => handleListChange('hotelPage.specials', idx, 'title', e.target.value)} className="admin-input" style={{ fontWeight: 'bold' }} />
                                                    </div>
                                                    <div>
                                                        <label className="admin-label">Description:</label>
                                                        <textarea rows={2} value={special.desc} onChange={(e) => handleListChange('hotelPage.specials', idx, 'desc', e.target.value)} className="admin-textarea" />
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRemoveItem('hotelPage.specials', idx)} className="admin-delete-btn" style={{ alignSelf: 'flex-start' }}>Delete</button>
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
                            <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#0f172a' }}>Spa Service Catalog</h2>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Add, edit, or remove services from the pricing tiers.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddItem('services', { title: 'New Spa Treatment', price: 150000, description: 'Enter service details', image: '/assets/service1.jpg', fullImage: '/assets/swedish-massage-full.jpg', delay: 'delay-100' })}
                                    className="admin-btn-primary admin-full-mobile"
                                >
                                    + Add New Service
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {siteContent.services.map((service, idx) => (
                                    <div key={idx} className="admin-item-card">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '180px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Card Photo:</p>
                                                    <img src={service.image} style={{ width: '100%', height: '55px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('services', idx, e.target.files[0], 'image')} className="admin-file-input" style={{ fontSize: '0.7rem', padding: '4px' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Modal Photo:</p>
                                                    <img src={service.fullImage} style={{ width: '100%', height: '55px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('services', idx, e.target.files[0], 'fullImage')} className="admin-file-input" style={{ fontSize: '0.7rem', padding: '4px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-item-grid">
                                            <div>
                                                <label className="admin-label">Service Title:</label>
                                                <input type="text" value={service.title} onChange={(e) => handleListChange('services', idx, 'title', e.target.value)} className="admin-input" style={{ fontWeight: 'bold' }} />
                                            </div>
                                            <div>
                                                <label className="admin-label">Price (UGX):</label>
                                                <input type="number" value={service.price} onChange={(e) => handleListChange('services', idx, 'price', parseInt(e.target.value) || 0)} className="admin-input" />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label className="admin-label">Description:</label>
                                                <textarea rows={2} value={service.description} onChange={(e) => handleListChange('services', idx, 'description', e.target.value)} className="admin-textarea" />
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveItem('services', idx)} className="admin-delete-btn" style={{ alignSelf: 'flex-start' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 6: HOTEL ROOMS */}
                    {activeTab === 'rooms' && (
                        <div>
                            <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#0f172a' }}>Hotel Rooms & Suites Catalog</h2>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Configure available room designs, rates, and specifications.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddItem('rooms', { title: 'New Executive Room', price: '120$ / UGX 420K', description: 'Room layout features & pricing details.', image: '/assets/hotel_rooms/economy_stay.jpg', delay: 'delay-100' })}
                                    className="admin-btn-primary admin-full-mobile"
                                >
                                    + Add New Room
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {siteContent.rooms.map((room, idx) => (
                                    <div key={idx} className="admin-item-card">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%', maxWidth: '140px' }}>
                                            <img src={room.image} alt={room.title} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                            <input type="file" accept="image/*" onChange={(e) => handleListImageUpload('rooms', idx, e.target.files[0], 'image')} className="admin-file-input" style={{ fontSize: '0.75rem' }} />
                                        </div>
                                        <div className="admin-item-grid">
                                            <div>
                                                <label className="admin-label">Room Name:</label>
                                                <input type="text" value={room.title} onChange={(e) => handleListChange('rooms', idx, 'title', e.target.value)} className="admin-input" style={{ fontWeight: 'bold' }} />
                                            </div>
                                            <div>
                                                <label className="admin-label">Price Label (e.g. 100$ / UGX 350K):</label>
                                                <input type="text" value={room.price} onChange={(e) => handleListChange('rooms', idx, 'price', e.target.value)} className="admin-input" />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label className="admin-label">Description details:</label>
                                                <textarea rows={2} value={room.description} onChange={(e) => handleListChange('rooms', idx, 'description', e.target.value)} className="admin-textarea" />
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveItem('rooms', idx)} className="admin-delete-btn" style={{ alignSelf: 'flex-start' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom Save Action Bar */}
                    <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button 
                            onClick={handleSaveContent} 
                            disabled={saving}
                            className="admin-save-btn admin-full-mobile"
                            style={{ padding: '14px 28px', fontSize: '1rem' }}
                        >
                            {saving ? '💾 Saving Changes...' : '💾 Save All Website Changes'}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
