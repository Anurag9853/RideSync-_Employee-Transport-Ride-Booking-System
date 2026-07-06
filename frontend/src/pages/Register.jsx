import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRegister } from '../api/axiosInstance.js';
import '../styles/auth.css';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && isValidEmail(email) && password.length >= 6 && !submitting;
  }, [name, email, password, submitting]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (name.trim().length < 2) return setError('Name must be at least 2 characters.');
    if (!isValidEmail(email)) return setError('Please enter a valid email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    try {
      setSubmitting(true);
      await apiRegister({
        name: name.trim(),
        email: email.trim(),
        password
      });

      setSuccess('Account created successfully! Redirecting to login…');
      setTimeout(() => navigate('/login', { replace: true }), 1000);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">R</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Register for the RideSync corporate ride platform.</p>

        {error ? <div className="auth-error">{error}</div> : null}
        {success ? <div className="auth-success">{success}</div> : null}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">
            Name
            <input
              className="auth-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </label>

          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />
          </label>

          <button className="btn primary btn-auth" type="submit" disabled={!canSubmit}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
