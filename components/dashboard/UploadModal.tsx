'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';

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
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc || !price) {
      setError('Please fill all required fields');
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
      formData.append('coverImage', coverUrl);
      if (pdfFile) {
        formData.append('file', pdfFile);
      }

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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
      overflowY: 'auto',
    }}>
      <div className="glass-panel glow-card" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '2.5rem',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <UploadCloud size={24} color="var(--brand-accent)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Publish New E-Book / PDF</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Upload your digital asset to protected server storage and immediately start generating ad links.
        </p>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.15)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: '#FF6B6B',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Micro-SaaS Operations Manual (2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
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
                type="number"
                required
                min="10"
                className="form-input"
                placeholder="499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hook / Short Summary *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="1-sentence high-conversion value proposition"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description / Outline</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Detailed breakdown of chapters, frameworks, and practical takeaways..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Page Count</label>
              <input
                type="number"
                className="form-input"
                placeholder="120"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (Comma Separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="SaaS, Code, Startup"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload PDF Document (or uses protected default)</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.02)',
            }}>
              <FileText size={28} color="var(--brand-primary)" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {pdfFile ? pdfFile.name : 'Select or Drag your PDF file here'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Files are stored securely in protected storage outside public root
              </div>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                id="pdf-upload-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPdfFile(e.target.files[0]);
                  }
                }}
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
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1rem' }}
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