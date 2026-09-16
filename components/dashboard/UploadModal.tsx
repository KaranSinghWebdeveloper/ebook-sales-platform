'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2, Image as ImageIcon, X, Plus } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Business & Tech');
  const [price, setPrice] = useState('499');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [pageCount, setPageCount] = useState('120');
  const [tags, setTags] = useState('Ebook,Guide,PDF');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Cover image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Gallery images (up to 5, optional)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - galleryFiles.length;
    const toAdd = files.slice(0, remaining);
    setGalleryFiles(prev => [...prev, ...toAdd]);
    setGalleryPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
    // Reset input so the same file can be re-selected
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc || !price) {
      setError('Please fill all required fields');
      return;
    }
    if (!coverFile && !coverPreview) {
      setError('Please upload a cover / feature image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('shortDesc', shortDesc);
      formData.append('description', description || shortDesc);
      formData.append('pageCount', pageCount);
      formData.append('tags', tags);

      if (coverFile) {
        formData.append('coverFile', coverFile);
      }

      if (pdfFile) {
        formData.append('file', pdfFile);
      }

      // Append gallery files individually
      galleryFiles.forEach((gf, i) => {
        formData.append(`galleryFile_${i}`, gf);
      });

      const res = await fetch('/api/seller/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload product');

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
      overflowY: 'auto',
    }}>
      <div className="glass-panel glow-card" style={{
        maxWidth: '620px',
        width: '100%',
        padding: '2.5rem',
        position: 'relative',
        maxHeight: '92vh',
        overflowY: 'auto',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer',
        }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <UploadCloud size={24} color="var(--brand-accent)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Publish New E-Book / PDF</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Upload your digital asset to protected server storage and immediately start generating ad links.
        </p>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.15)', border: '1px solid rgba(255, 107, 107, 0.3)',
            padding: '0.75rem 1rem', borderRadius: '8px', color: '#FF6B6B',
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              type="text" required className="form-input"
              placeholder="e.g. Micro-SaaS Operations Manual (2026)"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
                <option value="Business & Tech">Business & Tech</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance & Trading</option>
                <option value="Marketing">Marketing & Growth</option>
                <option value="Productivity">Productivity</option>
                <option value="Design Systems">Design Systems</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹ INR) *</label>
              <input
                type="number" required min="10" className="form-input"
                placeholder="499" value={price} onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hook / Short Summary *</label>
            <input
              type="text" required className="form-input"
              placeholder="1-sentence high-conversion value proposition"
              value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description / Outline</label>
            <textarea
              rows={3} className="form-textarea"
              placeholder="Detailed breakdown of chapters, frameworks, and practical takeaways..."
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Page Count</label>
              <input
                type="number" className="form-input"
                placeholder="120" value={pageCount} onChange={(e) => setPageCount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (Comma Separated)</label>
              <input
                type="text" className="form-input"
                placeholder="SaaS, Code, Startup"
                value={tags} onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* ── Cover / Feature Image ── */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={14} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
              Cover / Feature Image *
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="cover-upload-input"
              onChange={handleCoverChange}
            />
            {coverPreview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                />
                <button
                  type="button"
                  onClick={() => { setCoverFile(null); setCoverPreview(''); }}
                  style={{
                    position: 'absolute', top: '0.4rem', right: '0.4rem',
                    background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                    width: '26px', height: '26px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#fff',
                  }}
                >
                  <X size={14} />
                </button>
                <label
                  htmlFor="cover-upload-input"
                  className="btn btn-sm btn-secondary"
                  style={{ marginTop: '0.5rem', cursor: 'pointer', display: 'inline-flex' }}
                >
                  Change Image
                </label>
              </div>
            ) : (
              <label htmlFor="cover-upload-input" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem',
                border: '2px dashed var(--border-color)', borderRadius: '12px',
                padding: '1.5rem', cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s',
              }}>
                <ImageIcon size={30} color="var(--brand-primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload cover image</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP — shown on store card & detail page</span>
              </label>
            )}
          </div>

          {/* ── Gallery Images (optional, up to 5) ── */}
          <div className="form-group">
            <label className="form-label">
              <Plus size={13} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
              Additional Gallery Images
              <span style={{ color: 'var(--text-subtle)', fontWeight: 400, marginLeft: '0.4rem' }}>
                (optional · up to 5 images · shown in product detail)
              </span>
            </label>

            {galleryPreviews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {galleryPreviews.map((src, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`Gallery ${idx + 1}`}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: '50%',
                        width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: '#fff',
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {galleryFiles.length < 5 && (
                  <label htmlFor="gallery-upload-input" style={{
                    border: '2px dashed var(--border-color)', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', aspectRatio: '1', background: 'rgba(255,255,255,0.02)',
                  }}>
                    <Plus size={20} color="var(--text-muted)" />
                  </label>
                )}
              </div>
            )}

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              id="gallery-upload-input"
              onChange={handleGalleryChange}
            />

            {galleryPreviews.length === 0 && (
              <label htmlFor="gallery-upload-input" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '0.4rem',
                border: '2px dashed var(--border-color)', borderRadius: '12px',
                padding: '1.25rem', cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s',
              }}>
                <Plus size={24} color="var(--text-muted)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Add gallery images (optional)</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Up to 5 images — shown as a carousel in the product detail</span>
              </label>
            )}
          </div>

          {/* ── PDF Upload ── */}
          <div className="form-group">
            <label className="form-label">Upload PDF Document (optional — uses secure default if skipped)</label>
            <div style={{
              border: '2px dashed var(--border-color)', borderRadius: '12px',
              padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.02)',
            }}>
              <FileText size={28} color="var(--brand-primary)" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {pdfFile ? pdfFile.name : 'Select or Drag your PDF file here'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Stored securely outside public root — buyers get a time-limited access token
              </div>
              <input
                type="file" accept=".pdf"
                style={{ display: 'none' }} id="pdf-upload-input"
                onChange={(e) => { if (e.target.files?.[0]) setPdfFile(e.target.files[0]); }}
              />
              <label htmlFor="pdf-upload-input" className="btn btn-sm btn-secondary" style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
                Choose PDF File
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publishing Product...
              </>
            ) : (
              'Publish to Store & Generate Ad Links'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}