'use client';

import React, { useState } from 'react';
import { Wallet, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface WithdrawModalProps {
  walletBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawModal({ walletBalance, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState(walletBalance > 100 ? walletBalance.toString() : '100');
  const [method, setMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [beneficiary, setBeneficiary] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
      setError('Minimum withdrawal is ₹100');
      return;
    }
    if (withdrawAmount > walletBalance) {
      setError('Withdrawal amount exceeds available wallet balance');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const accountDetails = method === 'UPI'
        ? { upiId }
        : { bankName, accountNumber, ifsc, beneficiary };

      const res = await fetch('/api/seller/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          method,
          accountDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Withdrawal request failed');

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Request failed');
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
        maxWidth: '460px',
        width: '100%',
        padding: '2rem',
        position: 'relative',
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
          <Wallet size={22} color="var(--brand-accent)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Request Fund Withdrawal</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Available Withdrawable Balance:{' '}
          <strong style={{ color: 'var(--brand-accent)' }}>₹{walletBalance.toFixed(2)}</strong>
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={40} color="var(--brand-accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Request Submitted!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Your payout request has been queued for Super Admin approval and instant Razorpay Payout transfer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(255, 107, 107, 0.15)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                padding: '0.75rem',
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

            <div className="form-group">
              <label className="form-label">Amount to Withdraw (₹)</label>
              <input
                type="number"
                required
                min="100"
                max={walletBalance}
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                style={{
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: method === 'UPI' ? 'var(--brand-accent)' : 'var(--border-color)',
                  background: method === 'UPI' ? 'rgba(0, 212, 170, 0.15)' : 'transparent',
                  color: method === 'UPI' ? 'var(--brand-accent)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Direct UPI ID
              </button>
              <button
                type="button"
                onClick={() => setMethod('BANK')}
                style={{
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: method === 'BANK' ? 'var(--brand-accent)' : 'var(--border-color)',
                  background: method === 'BANK' ? 'rgba(0, 212, 170, 0.15)' : 'transparent',
                  color: method === 'BANK' ? 'var(--brand-accent)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Bank Transfer (NEFT/IMPS)
              </button>
            </div>

            {method === 'UPI' ? (
              <div className="form-group">
                <label className="form-label">UPI ID (e.g. yourname@okaxis)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="name@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Account Holder Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="HDFC Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="HDFC0001234"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || walletBalance < 100}
              className="btn btn-accent"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm Withdrawal of ₹${amount}`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}