import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { User, Lock, MapPin, Bell, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Locations state
  const [locations, setLocations] = useState([
    { id: 1, label: 'Primary Residence (Home)', address: '128 Orchid Parkway, Sector 4' },
    { id: 2, label: 'Corporate Headquarters', address: 'Building A, Tech Park Phase 2' },
    { id: 3, label: 'Satellite Office B', address: 'Industrial Zone Block G, Floor 3' }
  ]);
  const [newLocLabel, setNewLocLabel] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');

  // Toggles state
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    driverArrivalAlerts: true,
    weeklyDigest: true
  });

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill out all password fields.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSubmittingPassword(true);
    setTimeout(() => {
      showToast('Account password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSubmittingPassword(false);
    }, 1200);
  }

  function handleAddLocation(e) {
    e.preventDefault();
    if (!newLocLabel || !newLocAddress) return;
    const newLoc = {
      id: Date.now(),
      label: newLocLabel.trim(),
      address: newLocAddress.trim()
    };
    setLocations((prev) => [...prev, newLoc]);
    setNewLocLabel('');
    setNewLocAddress('');
    showToast('Saved location registered.', 'success');
  }

  function handleDeleteLocation(id) {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    showToast('Saved location deleted.', 'info');
  }

  function handleTogglePref(key) {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast('Preferences updated.', 'success');
  }

  const avatarLetters = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US';

  return (
    <div className="settings-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Account Settings</h1>
          <p className="page-subtitle">Manage login passwords, location presets, and notification triggers</p>
        </div>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Profile Card & Password change */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Overview Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem', borderRadius: '50%' }}>
              {avatarLetters}
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'User'}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <span className="badge active" style={{ fontSize: '0.6875rem' }}>
                  {user?.role ? String(user.role).toUpperCase() : 'EMPLOYEE'}
                </span>
                <span className="badge pending" style={{ fontSize: '0.6875rem' }}>Active Profile</span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} />
              Security Settings
            </h3>
            <form onSubmit={handlePasswordChange} className="auth-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn primary" disabled={submittingPassword} style={{ marginTop: '6px' }}>
                {submittingPassword ? 'Saving Password…' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Locations & Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Saved Transit Locations */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} />
              Saved Commute Addresses
            </h3>

            {/* List of locations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-sidebar)'
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: '12px' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>{loc.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {loc.address}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn danger"
                    style={{ padding: '6px 10px', fontSize: '0.6875rem' }}
                    onClick={() => handleDeleteLocation(loc.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add address */}
            <form onSubmit={handleAddLocation} className="auth-form" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Address Tag</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="e.g. Summer House / Branch Office C"
                  value={newLocLabel}
                  onChange={(e) => setNewLocLabel(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="Full street address..."
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                />
              </div>
              <button type="submit" className="btn secondary" style={{ alignSelf: 'start' }}>
                Save Preset
              </button>
            </form>
          </div>

          {/* Preferences Toggles */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} />
              Notification Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>Email Confirmations</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send confirmation summaries to corporate email.</div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  checked={preferences.emailAlerts}
                  onChange={() => handleTogglePref('emailAlerts')}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>SMS Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive dispatch and cancellation SMS messages on phone.</div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  checked={preferences.smsAlerts}
                  onChange={() => handleTogglePref('smsAlerts')}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>Driver Proximity Ring</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify when vehicle is within 5 minutes of pickup Gate.</div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  checked={preferences.driverArrivalAlerts}
                  onChange={() => handleTogglePref('driverArrivalAlerts')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
