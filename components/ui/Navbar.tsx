'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ShoppingBag, ShieldCheck, LayoutDashboard, LogIn, UserPlus, LogOut } from 'lucide-react';

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
  walletBalance?: number;
}

export function Navbar({ siteName = 'DigiVault' }: { siteName?: string }) {
  const [user, setUser] = useState<NavUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 50,
      margin: '0 auto 1.5rem auto',
      maxWidth: '1240px',
      width: 'calc(100% - 2rem)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }}>
      {/* Brand Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px var(--brand-primary-glow)',
        }}>
          <BookOpen size={20} color="#FFFFFF" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
            {siteName}
          </span>
          <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--brand-accent)', fontWeight: 600, marginTop: '-3px' }}>
            DIGITAL PRODUCTS
          </span>
        </div>
      </Link>

      {/* Center Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/store" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.2s' }}>
          <ShoppingBag size={17} />
          Explore Store
        </Link>
        <Link href="/#how-it-works" style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          How it Works
        </Link>
        <Link href="/#trust" style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          Razorpay Protected
        </Link>
      </nav>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {loading ? (
          <div style={{ width: '80px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
        ) : user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user.role === 'SUPER_ADMIN' && (
              <Link href="/admin" className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--brand-primary)' }}>
                <ShieldCheck size={16} color="var(--brand-primary)" />
                Super Admin
              </Link>
            )}

            {user.role === 'SELLER' && (
              <Link href="/dashboard" className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--brand-accent)' }}>
                <LayoutDashboard size={16} color="var(--brand-accent)" />
                Seller Dashboard (₹{user.walletBalance || 0})
              </Link>
            )}

            <button onClick={handleLogout} className="btn btn-sm btn-secondary" title="Logout" style={{ padding: '0.45rem 0.65rem' }}>
              <LogOut size={16} color="var(--text-muted)" />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link href="/login" className="btn btn-sm btn-secondary">
              <LogIn size={15} />
              Sign In
            </Link>
            <Link href="/register?role=SELLER" className="btn btn-sm btn-primary">
              <UserPlus size={15} />
              Start Selling
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}