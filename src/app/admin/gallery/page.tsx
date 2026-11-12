"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceItem {
  title: string;
  price: number | string;
  image: string;
  fullImage?: string;
  description: string;
  delay?: string;
  needsCrop?: boolean;
  imageOnly?: boolean;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  delay?: string;
}

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState<"gallery" | "services" | "info">("gallery");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Site Content State
  const [siteContent, setSiteContent] = useState<any>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchService, setSearchService] = useState("");

  // New Service Form
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    title: "",
    price: 150000,
    description: "",
    image: "/assets/service1.jpg",
  });
  const [showAddService, setShowAddService] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "Serenityspa256.") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password. Please check your credentials.");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Gallery
      const galRes = await fetch("/api/gallery");
      if (galRes.ok) {
        const galData = await galRes.json();
        setGalleryImages(galData);
      }

      // 2. Load Content
      const contentRes = await fetch("/api/content");
      if (contentRes.ok) {
        const cData = await contentRes.json();
        setSiteContent(cData);
        if (cData.services) {
          setServices(cData.services);
        }
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload file helper
  const uploadImageFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password.trim()}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.secure_url;
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
        return null;
      }
    } catch (e: any) {
      alert("Error uploading image: " + e.message);
      return null;
    }
  };

  // Add Gallery Image
  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageFile) return;

    setUploadingGallery(true);
    const formData = new FormData();
    formData.append("file", newImageFile);
    formData.append("alt", imageAlt || "The Serenity Spa");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password.trim()}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setGalleryImages([data.image, ...galleryImages]);
        setNewImageFile(null);
        setImagePreview(null);
        setImageAlt("");
        alert("Image uploaded successfully to Cloudinary!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to upload to gallery");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image from Cloudinary?")) return;

    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${password.trim()}`,
        },
      });

      if (res.ok) {
        setGalleryImages(galleryImages.filter((img) => img.id !== id));
      } else {
        alert("Failed to delete image.");
      }
    } catch (e: any) {
      alert("Error deleting image: " + e.message);
    }
  };

  // Service Management
  const handleUpdateService = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleDeleteService = (index: number) => {
    if (!confirm(`Delete service "${services[index].title}"?`)) return;
    const updated = services.filter((_, i) => i !== index);
    setServices(updated);
  };

  const handleAddService = () => {
    if (!newService.title) {
      alert("Please enter a service title");
      return;
    }
    const updated = [newService as ServiceItem, ...services];
    setServices(updated);
    setNewService({
      title: "",
      price: 150000,
      description: "",
      image: "/assets/service1.jpg",
    });
    setShowAddService(false);
  };

  // Save All Changes to Cloudinary
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedContent = {
        ...siteContent,
        services,
      };

      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password.trim()}`,
        },
        body: JSON.stringify(updatedContent),
      });

      if (res.ok) {
        alert("All changes successfully saved and synced with Cloudinary!");
        setSiteContent(updatedContent);
      } else {
        const err = await res.json();
        alert("Error saving: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e1317] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md p-8 rounded-2xl border shadow-2xl"
          style={{
            backgroundColor: "#161c22",
            borderColor: "rgba(197, 168, 128, 0.25)",
          }}
        >
          <div className="text-center mb-8">
            <h1
              style={{
                fontFamily: "Cormorant, serif",
                fontSize: "2rem",
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              The Serenity Spa
            </h1>
            <p className="text-sm tracking-widest text-[#c5a880] uppercase mt-1 font-semibold">
              Admin Portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-300 mb-2 tracking-wider">
                Admin Passkey
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl bg-[#0e1317] border border-gray-700 text-white text-sm outline-none focus:border-[#c5a880] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-transform active:scale-95 shadow-lg"
              style={{
                backgroundColor: "#c5a880",
                color: "#0e1317",
              }}
            >
              Authenticate & Unlock
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-[#c5a880] transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1317] text-gray-200">
      {/* Top Navbar */}
      <header
        className="sticky top-0 z-40 px-6 py-4 border-b flex justify-between items-center"
        style={{
          backgroundColor: "#161c22",
          borderColor: "rgba(197, 168, 128, 0.2)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-white text-lg tracking-wider" style={{ fontFamily: "Cormorant, serif" }}>
            THE SERENITY SPA
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase" style={{ backgroundColor: "#c5a880", color: "#0e1317" }}>
            Admin CMS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
            style={{ backgroundColor: "#25D366", color: "#ffffff" }}
          >
            {saving ? "💾 Saving to Cloudinary..." : "💾 Save All Changes"}
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 border border-gray-700 rounded-lg hover:bg-white/5"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Tabs Subheader */}
      <div className="px-6 py-3 border-b border-gray-800 bg-[#11171d] flex gap-3">
        {[
          { id: "gallery", label: "📸 Spa Gallery", count: galleryImages.length },
          { id: "services", label: "💅 Treatments & Pricing", count: services.length },
          { id: "info", label: "💆 Contacts & Info" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="px-5 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors flex items-center gap-2"
            style={{
              backgroundColor: activeTab === tab.id ? "#c5a880" : "transparent",
              color: activeTab === tab.id ? "#0e1317" : "#9ca3af",
              border: activeTab === tab.id ? "1px solid #c5a880" : "1px solid transparent",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: activeTab === tab.id ? "#0e1317" : "rgba(255,255,255,0.1)",
                  color: activeTab === tab.id ? "#c5a880" : "#ffffff",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: "#c5a880" }}></div>
            <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest font-semibold">Connecting to Cloudinary...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: GALLERY MANAGER */}
            {activeTab === "gallery" && (
              <div className="space-y-8">
                {/* Upload Card */}
                <div className="p-6 rounded-2xl bg-[#161c22] border border-gray-800 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2" style={{ color: "#c5a880" }}>
                    + Upload New Photo to Gallery
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Photos are instantly hosted on Cloudinary in the <code className="text-[#c5a880]">serenity_gallery</code> folder.
                  </p>

                  <form onSubmit={handleAddGalleryImage} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">Select Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#c5a880] file:text-[#0e1317] hover:file:opacity-90 cursor-pointer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">Description / Alt Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Couple Treatment Suite"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0e1317] border border-gray-700 text-xs text-white outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={uploadingGallery || !newImageFile}
                        className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all shadow-md"
                        style={{ backgroundColor: "#c5a880", color: "#0e1317" }}
                      >
                        {uploadingGallery ? "Uploading..." : "Upload to Cloudinary"}
                      </button>
                    </div>
                  </form>

                  {imagePreview && (
                    <div className="mt-4 p-3 bg-black/40 rounded-xl inline-flex items-center gap-4 border border-gray-800">
                      <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                      <span className="text-xs text-gray-400">{newImageFile?.name}</span>
                    </div>
                  )}
                </div>

                {/* Existing Gallery Images */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
                    Current Gallery Photos ({galleryImages.length})
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryImages.map((img) => (
                      <div
                        key={img.id || img.src}
                        className="group relative rounded-xl overflow-hidden bg-[#161c22] border border-gray-800 shadow-md aspect-square flex flex-col justify-end p-3"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                        <div className="relative z-10">
                          <p className="text-[11px] font-semibold text-white truncate mb-2">{img.alt}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            className="w-full py-1.5 rounded text-[10px] font-bold bg-red-600/90 hover:bg-red-600 text-white uppercase tracking-wider transition-colors shadow"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & PRICING */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#161c22] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddService(!showAddService)}
                      className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: "#c5a880", color: "#0e1317" }}
                    >
                      {showAddService ? "Cancel" : "+ Add New Treatment"}
                    </button>
                    <span className="text-xs text-gray-400">Manage all 30 treatments and pricing.</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 rounded-lg bg-[#0e1317] border border-gray-700 text-xs text-white outline-none focus:border-[#c5a880]"
                  />
                </div>

                {/* Add Service Card */}
                {showAddService && (
                  <div className="p-6 rounded-2xl bg-[#161c22] border border-[#c5a880]/40 shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-[#c5a880] uppercase tracking-wider">New Treatment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Service Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Deluxe Herbal Bath"
                          value={newService.title || ""}
                          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#0e1317] border border-gray-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Price (UGX)</label>
                        <input
                          type="number"
                          placeholder="e.g. 250000"
                          value={newService.price || 0}
                          onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded bg-[#0e1317] border border-gray-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Image Asset URL / Path</label>
                        <input
                          type="text"
                          placeholder="/assets/service1.jpg"
                          value={newService.image || ""}
                          onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#0e1317] border border-gray-700 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed description of the treatment session..."
                        value={newService.description || ""}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#0e1317] border border-gray-700 text-xs text-white"
                      ></textarea>
                    </div>
                    <button
                      onClick={handleAddService}
                      className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-[#c5a880]"
                    >
                      Save Treatment to List
                    </button>
                  </div>
                )}

                {/* Services List Table */}
                <div className="space-y-4">
                  {services
                    .filter((s) => s.title.toLowerCase().includes(searchService.toLowerCase()))
                    .map((service, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-[#161c22] border border-gray-800 shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-16 h-16 object-cover rounded-lg bg-black border border-gray-700 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/service1.jpg";
                            }}
                          />
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => handleUpdateService(idx, "title", e.target.value)}
                              className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-gray-600 focus:border-[#c5a880] outline-none w-full"
                            />
                            <textarea
                              rows={2}
                              value={service.description}
                              onChange={(e) => handleUpdateService(idx, "description", e.target.value)}
                              className="text-xs text-gray-400 bg-transparent border border-transparent hover:border-gray-700 focus:border-gray-600 outline-none w-full p-1 rounded"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-semibold">Price (UGX)</label>
                            <input
                              type="number"
                              value={typeof service.price === "number" ? service.price : parseInt(String(service.price)) || 0}
                              onChange={(e) => handleUpdateService(idx, "price", Number(e.target.value))}
                              className="w-28 px-2 py-1.5 rounded bg-[#0e1317] border border-gray-700 text-xs font-bold text-[#c5a880] outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteService(idx)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors text-xs"
                            title="Delete service"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: CONTACTS & SPA INFO */}
            {activeTab === "info" && siteContent && (
              <div className="p-8 rounded-2xl bg-[#161c22] border border-gray-800 space-y-6 max-w-3xl">
                <h3 className="text-base font-bold text-white mb-2" style={{ color: "#c5a880" }}>
                  Spa Contact & Location Information
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Updating these details changes the phone, WhatsApp links, and locations across the entire website.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Spa WhatsApp (e.g. +256781945510)</label>
                    <input
                      type="text"
                      value={siteContent.contact?.spa?.whatsapp || "+256781945510"}
                      onChange={(e) => {
                        const copy = { ...siteContent };
                        if (!copy.contact) copy.contact = {};
                        if (!copy.contact.spa) copy.contact.spa = {};
                        copy.contact.spa.whatsapp = e.target.value;
                        setSiteContent(copy);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0e1317] border border-gray-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Spa Phone Line</label>
                    <input
                      type="text"
                      value={siteContent.contact?.spa?.phone || "+256764001922"}
                      onChange={(e) => {
                        const copy = { ...siteContent };
                        if (!copy.contact) copy.contact = {};
                        if (!copy.contact.spa) copy.contact.spa = {};
                        copy.contact.spa.phone = e.target.value;
                        setSiteContent(copy);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0e1317] border border-gray-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Physical Locations</label>
                  <input
                    type="text"
                    value={siteContent.homepage?.spaContent?.location || "Sir Apollo Kaggwa road & Mengo"}
                    onChange={(e) => {
                      const copy = { ...siteContent };
                      if (!copy.homepage) copy.homepage = {};
                      if (!copy.homepage.spaContent) copy.homepage.spaContent = {};
                      copy.homepage.spaContent.location = e.target.value;
                      setSiteContent(copy);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0e1317] border border-gray-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Spa Tagline</label>
                  <input
                    type="text"
                    value={siteContent.homepage?.spaContent?.tagline || "Oasis of Relaxation in Kampala"}
                    onChange={(e) => {
                      const copy = { ...siteContent };
                      if (!copy.homepage) copy.homepage = {};
                      if (!copy.homepage.spaContent) copy.homepage.spaContent = {};
                      copy.homepage.spaContent.tagline = e.target.value;
                      setSiteContent(copy);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0e1317] border border-gray-700 text-xs text-white"
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-[#c5a880]"
                  >
                    {saving ? "Saving to Cloudinary..." : "Save Contact Info"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
