'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, Sparkles } from 'lucide-react';

interface ShareModalProps {
  product: {
    title: string;
    slug: string;
    shareKey: string;
  };
  onClose: () => void;
}

export function ShareLinkModal({ product, onClose }: ShareModalProps) {
  const [source, setSource] = useState('meta_ads');
  const [campaign, setCampaign] = useState('ebook_launch');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const directLink = `${baseUrl}/product/${product.slug}?ref=${product.shareKey}`;
  const adLink = `${directLink}&utm_source=${source}&utm_campaign=${campaign}`;

  useEffect(() => {
    QRCode.toDataURL(adLink, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0A0A12',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [adLink]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr_${product.slug}_${source}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      padding: '1rem',
    }}>
      <div className="glass-panel glow-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
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
          <Sparkles size={20} color="var(--brand-accent)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Campaign Ad Link Generator</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Generate custom tracking links and high-res QR codes for <strong>{product.title}</strong> to use in Facebook Ads, Instagram Reels, YouTube descriptions, or WhatsApp broadcasts.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Advertising Platform</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="form-select"
            >
              <option value="meta_ads">Instagram & Facebook Ads</option>
              <option value="google_ads">Google Search & Display</option>
              <option value="youtube">YouTube Description</option>
              <option value="whatsapp">WhatsApp Direct Broadcast</option>
              <option value="twitter">X / Twitter</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Campaign Name</label>
            <input
              type="text"
              className="form-input"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. spring_promo"
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--brand-accent)',
            fontFamily: 'monospace',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {adLink}
          </div>
          <button onClick={copyToClipboard} className="btn btn-sm btn-primary" style={{ flexShrink: 0 }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Product QR"
              style={{ width: '110px', height: '110px', borderRadius: '8px', background: '#FFFFFF', padding: '4px' }}
            />
          ) : (
            <div style={{ width: '110px', height: '110px', background: '#222', borderRadius: '8px' }} />
          )}

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              Downloadable QR Code
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              Ready to print or embed into Instagram stories, video overlays, and presentation slides.
            </p>
            <button onClick={downloadQrCode} className="btn btn-sm btn-secondary">
              <Download size={14} />
              Save PNG Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}