import React, { useEffect, useState } from 'react';
import { getMockVehicles, saveMockVehicles, getMockDrivers } from '../utils/mockStorage.js';
import { useToast } from '../hooks/useToast.js';
import { useModal } from '../hooks/useModal.js';
import Modal from '../components/common/Modal.jsx';
import { Search, Plus, Edit2, Trash2, Shield, Info, Users as UsersIcon } from 'lucide-react';

export default function Vehicles({ readOnly = false }) {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [drivers, setDrivers] = useState([]);
  const { showToast } = useToast();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  useEffect(() => {
    loadVehicles();
    setDrivers(getMockDrivers());
  }, []);

  function loadVehicles() {
    setVehicles(getMockVehicles());
  }

  function handleSaveVehicle(payload) {
    let list = [...vehicles];
    if (modalData?.type === 'edit') {
      list = list.map((v) =>
        v.registrationNumber === modalData.vehicle.registrationNumber ? { ...v, ...payload } : v
      );
      showToast('Vehicle updated successfully.', 'success');
    } else {
      // Prevent duplicates
      if (vehicles.some((v) => v.registrationNumber === payload.registrationNumber)) {
        showToast('A vehicle with this registration plate already exists.', 'error');
        return;
      }
      list.push({
        ...payload,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
      });
      showToast('Vehicle added to fleet successfully.', 'success');
    }
    saveMockVehicles(list);
    setVehicles(list);
    closeModal();
  }

  function handleDeleteVehicle(regNum) {
    if (!window.confirm(`Are you sure you want to remove vehicle ${regNum} from the fleet?`)) {
      return;
    }
    const list = vehicles.filter((v) => v.registrationNumber !== regNum);
    saveMockVehicles(list);
    setVehicles(list);
    showToast('Vehicle removed from fleet.', 'success');
  }

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="vehicles-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Corporate Fleet</h1>
          <p className="page-subtitle">Vehicle maintenance logs, passenger capacities, and drivers</p>
        </div>
        {!readOnly && (
          <button className="btn primary" onClick={() => openModal({ type: 'create' })}>
            <Plus size={14} style={{ marginRight: '6px' }} />
            Add Vehicle
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
              placeholder="Search vehicle model or license plate..."
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
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid of Vehicles */}
      {filteredVehicles.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '60px' }}>
          No vehicles registered in this category.
        </div>
      ) : (
        <div className="grid-cols-2">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.registrationNumber}
              className="card interactive animate-fade"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '120px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {vehicle.model}
                      </h3>
                      <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {vehicle.registrationNumber}
                      </span>
                    </div>
                    <span
                      className={`badge ${
                        vehicle.status === 'Active' ? 'active' : 'cancelled'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <UsersIcon size={12} />
                      {vehicle.capacity} seats
                    </span>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <Shield size={12} />
                      {vehicle.type}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Driver:</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                    {vehicle.driverAssigned || 'No driver assigned'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Maintenance Status:</span>
                  <span
                    className={
                      vehicle.maintenanceStatus === 'Serviced' ? 'text-success' : 'text-warning'
                    }
                    style={{ fontWeight: 500 }}
                  >
                    {vehicle.maintenanceStatus}
                  </span>
                </div>
              </div>

              {!readOnly && (
                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    className="btn secondary"
                    style={{ flex: 1 }}
                    onClick={() => openModal({ type: 'edit', vehicle })}
                  >
                    <Edit2 size={12} style={{ marginRight: '6px' }} />
                    Edit Details
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDeleteVehicle(vehicle.registrationNumber)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalData?.type === 'edit' ? 'Modify Fleet Record' : 'Add Vehicle to Fleet'}
          size="small"
        >
          <VehicleForm
            vehicle={modalData?.vehicle}
            drivers={drivers}
            onSave={handleSaveVehicle}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}

function VehicleForm({ vehicle, drivers, onSave, onCancel }) {
  const [model, setModel] = useState(vehicle?.model || '');
  const [registrationNumber, setRegistrationNumber] = useState(vehicle?.registrationNumber || '');
  const [type, setType] = useState(vehicle?.type || 'SUV');
  const [capacity, setCapacity] = useState(vehicle?.capacity || 7);
  const [driverAssigned, setDriverAssigned] = useState(vehicle?.driverAssigned || '');
  const [status, setStatus] = useState(vehicle?.status || 'Active');
  const [maintenanceStatus, setMaintenanceStatus] = useState(vehicle?.maintenanceStatus || 'Serviced');

  const isEdit = Boolean(vehicle);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ model, registrationNumber, type, capacity, driverAssigned, status, maintenanceStatus });
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label className="form-label">Vehicle Model / Name</label>
        <input
          type="text"
          className="input"
          required
          placeholder="e.g. Toyota Innova"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Registration Plate Number</label>
        <input
          type="text"
          className="input"
          required
          disabled={isEdit}
          placeholder="e.g. KA-03-MM-1234"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
      </div>

      <div className="grid-cols-2" style={{ gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Vehicle Type</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Van">Shuttle Van</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Seating Capacity</label>
          <input
            type="number"
            className="input"
            required
            min="1"
            max="50"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Assign Driver</label>
        <select
          className="select"
          value={driverAssigned}
          onChange={(e) => setDriverAssigned(e.target.value)}
        >
          <option value="">No Driver Assigned</option>
          {drivers.map((drv) => (
            <option key={drv.id} value={drv.name}>
              {drv.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-cols-2" style={{ gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Active Status</label>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Maintenance Log</label>
          <select
            className="select"
            value={maintenanceStatus}
            onChange={(e) => setMaintenanceStatus(e.target.value)}
          >
            <option value="Serviced">Serviced & Cleaned</option>
            <option value="Needs Service">Needs Service</option>
            <option value="In Repair">In Repair</option>
          </select>
        </div>
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'end', marginTop: '12px' }}>
        <button type="button" className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          Save Vehicle
        </button>
      </div>
    </form>
  );
}
