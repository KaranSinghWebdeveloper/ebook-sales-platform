'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { User, Store, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'SELLER' ? 'SELLER' : 'BUYER';

  const [role, setRole] = useState<'BUYER' | 'SELLER'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          storeName: role === 'SELLER' ? (storeName || `${name}'s Store`) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      window.location.href = data.redirectUrl || '/store';
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel glow-card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join the digital publishing marketplace with automated Razorpay payouts.
          </p>
        </div>

        {/* Role Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.75rem',
        }}>
          <button
            type="button"
            onClick={() => setRole('SELLER')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: role === 'SELLER' ? 'var(--brand-accent)' : 'var(--border-color)',
              background: role === 'SELLER' ? 'rgba(0, 212, 170, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              color: role === 'SELLER' ? 'var(--brand-accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <Store size={20} style={{ margin: '0 auto 0.35rem auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>I Want to Sell</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>85% Revenue Split</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('BUYER')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: role === 'BUYER' ? 'var(--brand-primary)' : 'var(--border-color)',
              background: role === 'BUYER' ? 'rgba(108, 71, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: role === 'BUYER' ? '#B892FF' : 'var(--text-muted)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <User size={20} style={{ margin: '0 auto 0.35rem auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>I Want to Buy</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Instant Downloads</div>
          </button>
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Priya Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {role === 'SELLER' && (
            <div className="form-group">
              <label className="form-label">Brand / Store Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Apex Knowledge Labs"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={role === 'SELLER' ? 'btn btn-accent' : 'btn btn-primary'}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                {role === 'SELLER' ? 'Launch Seller Dashboard' : 'Create Free Account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}