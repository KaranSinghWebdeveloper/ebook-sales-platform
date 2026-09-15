'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Download, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuyModalProps {
  product: {
    id: string;
    title: string;
    price: number;
    coverImage: string;
    pageCount?: number | null;
  };
  onClose: () => void;
}

export function BuyModal({ product, onClose }: BuyModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadToken, setDownloadToken] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email to receive the download access');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerEmail: email,
          buyerName: name || 'Valued Reader',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      if (typeof window !== 'undefined' && (window as any).Razorpay && !orderData.isSimulated) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'DigiVault Store',
          description: product.title,
          order_id: orderData.razorpayOrderId,
          prefill: { name, email },
          theme: { color: '#6C47FF' },
          handler: async function (response: any) {
            await verifyAndUnlock(orderData.orderId, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        await verifyAndUnlock(orderData.orderId, orderData.razorpayOrderId, 'pay_mock_' + Date.now(), 'sig_mock');
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      setLoading(false);
    }
  };

  const verifyAndUnlock = async (orderId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed');

      setDownloadToken(verifyData.downloadToken);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
    } finally {
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
      padding: '1rem',
    }}>
      <div className="glass-panel glow-card" style={{
        maxWidth: '480px',
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

        {downloadToken ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 212, 170, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}>
              <CheckCircle2 size={36} color="var(--brand-accent)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payment Successful!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your transaction was verified via Razorpay. Your secure download access is ready.
            </p>

            <a
              href={`/api/download/${downloadToken}`}
              download
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '1rem' }}
            >
              <Download size={18} />
              Download PDF E-Book Now
            </a>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Link is valid for 72 hours and up to 5 downloads. Receipt queued for {email}.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <img
                src={product.coverImage}
                alt={product.title}
                style={{ width: '64px', height: '85px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>Direct Checkout</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>{product.title}</h4>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-accent)', marginTop: '0.25rem' }}>
                  ₹{product.price}
                </div>
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
                marginBottom: '1rem',
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Your Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (for PDF Delivery) *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
              }}>
                <ShieldCheck size={18} color="var(--brand-accent)" />
                <span>Protected by Razorpay with instant automated PDF decryption</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Securing Order...
                  </>
                ) : (
                  `Pay ₹${product.price} via Razorpay`
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}