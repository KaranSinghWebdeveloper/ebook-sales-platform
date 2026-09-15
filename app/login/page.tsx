'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = data.redirectUrl || '/store';
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel glow-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Access your seller dashboard, downloads, or administration panel.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.75rem',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-accent)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Quick 1-Click Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@digivault.com', 'adminpassword123')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
            >
              <ShieldCheck size={14} color="var(--brand-primary)" />
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('seller@digivault.com', 'sellerpassword123')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
            >
              <LayoutDashboard size={14} color="var(--brand-accent)" />
              Verified Seller
            </button>
          </div>
        </div>

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
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
}