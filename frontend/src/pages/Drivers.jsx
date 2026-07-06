import React, { useEffect, useState } from 'react';
import { getMockDrivers, saveMockDrivers, getMockVehicles } from '../utils/mockStorage.js';
import { useToast } from '../hooks/useToast.js';
import { useModal } from '../hooks/useModal.js';
import Modal from '../components/common/Modal.jsx';
import { Star, Phone, Mail, Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Drivers({ readOnly = false }) {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vehicles, setVehicles] = useState([]);
  const { showToast } = useToast();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  useEffect(() => {
    loadDrivers();
    setVehicles(getMockVehicles());
  }, []);

  function loadDrivers() {
    setDrivers(getMockDrivers());
  }

  function handleSaveDriver(payload) {
    let list = [...drivers];
    if (modalData?.type === 'edit') {
      list = list.map((d) => (d.id === modalData.driver.id ? { ...d, ...payload } : d));
      showToast('Driver updated successfully.', 'success');
    } else {
      const newId = `DRV-${String(drivers.length + 1).padStart(3, '0')}`;
      list.push({
        id: newId,
        ...payload,
        rating: 5.0,
        completedRides: 0,
        avatar: payload.name.split(' ').map((n) => n[0]).join('').toUpperCase()
      });
      showToast('Driver registered successfully.', 'success');
    }
    saveMockDrivers(list);
    setDrivers(list);
    closeModal();
  }

  function handleDeleteDriver(id, name) {
    if (!window.confirm(`Are you sure you want to remove driver "${name}"?`)) {
      return;
    }
    const list = drivers.filter((d) => d.id !== id);
    saveMockDrivers(list);
    setDrivers(list);
    showToast('Driver removed successfully.', 'success');
  }

  // Filtering logic
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="drivers-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Drivers Directory</h1>
          <p className="page-subtitle">Contact details, rating reports, and vehicle assignments</p>
        </div>
        {!readOnly && (
          <button className="btn primary" onClick={() => openModal({ type: 'create' })}>
            <Plus size={14} style={{ marginRight: '6px' }} />
            Add Driver
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="table-controls" style={{ marginBottom: '20px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '500px' }}>
          <div className="search-container" style={{ width: '100%' }}>
            <Search className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search driver by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select"
            style={{ width: '140px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Grid of Drivers */}
      {filteredDrivers.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '60px' }}>
          No drivers match the current filters.
        </div>
      ) : (
        <div className="grid-cols-2">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="card interactive animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                    {driver.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>{driver.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: <strong className="text-mono">{driver.id}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '4px' }}>
                  <span className={`badge ${driver.status === 'Available' ? 'active' : driver.status === 'On Trip' ? 'pending' : 'cancelled'}`}>
                    {driver.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    <Star size={12} fill="#eab308" stroke="#eab308" />
                    {driver.rating}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Vehicle:</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{driver.vehicleAssigned || 'None'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>License Number:</span>
                  <span className="text-mono" style={{ color: 'var(--text-main)' }}>{driver.licenseNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Trips Completed:</span>
                  <span className="text-mono" style={{ color: 'var(--text-main)' }}>{driver.completedRides}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <a href={`tel:${driver.phone}`} className="btn secondary" style={{ flex: 1 }}>
                  <Phone size={12} />
                  Call
                </a>
                <a href={`mailto:${driver.email}`} className="btn secondary" style={{ flex: 1 }}>
                  <Mail size={12} />
                  Email
                </a>
                {!readOnly && (
                  <>
                    <button className="btn secondary" onClick={() => openModal({ type: 'edit', driver })}>
                      <Edit2 size={12} />
                    </button>
                    <button className="btn danger" onClick={() => handleDeleteDriver(driver.id, driver.name)}>
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalData?.type === 'edit' ? 'Edit Driver Details' : 'Register Driver'}
          size="small"
        >
          <DriverForm
            driver={modalData?.driver}
            vehicles={vehicles}
            onSave={handleSaveDriver}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}

function DriverForm({ driver, vehicles, onSave, onCancel }) {
  const [name, setName] = useState(driver?.name || '');
  const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber || '');
  const [vehicleAssigned, setVehicleAssigned] = useState(driver?.vehicleAssigned || '');
  const [status, setStatus] = useState(driver?.status || 'Available');
  const [phone, setPhone] = useState(driver?.phone || '');
  const [email, setEmail] = useState(driver?.email || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name, licenseNumber, vehicleAssigned, status, phone, email });
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input type="text" className="input" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">License Number</label>
        <input type="text" className="input" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Assign Vehicle</label>
        <select className="select" value={vehicleAssigned} onChange={(e) => setVehicleAssigned(e.target.value)}>
          <option value="">No Vehicle Assigned</option>
          {vehicles.map((v) => (
            <option key={v.registrationNumber} value={`${v.model} (${v.registrationNumber})`}>
              {v.model} - {v.registrationNumber}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="Offline">Offline</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Phone Contact</label>
        <input type="text" className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'end', marginTop: '12px' }}>
        <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save Changes</button>
      </div>
    </form>
  );
}
