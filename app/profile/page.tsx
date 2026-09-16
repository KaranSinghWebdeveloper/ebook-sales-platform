'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    bio: '',
    avatar: '',
    bankDetails: '',
    upiId: '',
  });

  const [role, setRole] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setRole(data.user.role);
          setFormData({
            name: data.user.name || '',
            storeName: data.user.storeName || '',
            bio: data.user.bio || '',
            avatar: data.user.avatar || '',
            bankDetails: data.user.bankDetails || '',
            upiId: data.user.upiId || '',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await res.json();
        setMessage(error.error || 'Failed to update profile');
      }
    } catch {
      setMessage('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <Loader2 className="animate-spin" size={32} color="var(--brand-primary)" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 6rem 1.5rem', maxWidth: '800px' }}>
      <Link href={role === 'SUPER_ADMIN' ? '/admin' : role === 'SELLER' ? '/dashboard' : '/store'} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Back
      </Link>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <User size={28} color="var(--brand-primary)" />
          My Profile
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Update your personal details, public store profile, and payout information.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            background: message.includes('success') ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 107, 107, 0.1)', 
            color: message.includes('success') ? 'var(--brand-accent)' : '#FF6B6B',
            marginBottom: '1.5rem',
            border: `1px solid ${message.includes('success') ? 'var(--brand-accent)' : '#FF6B6B'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Avatar URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>
        </div>

        {role === 'SELLER' && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              Public Store Settings
            </h3>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Store / Pen Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="What buyers see"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Public Bio</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Tell buyers about yourself and your expertise..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              Payout & Bank Details
            </h3>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">UPI ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="you@upi"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Bank Account Details</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Account Name, Number, IFSC..."
                value={formData.bankDetails}
                onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
              />
            </div>
          </>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
