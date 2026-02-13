import React, { useEffect, useState } from 'react';
import {
  apiGetAdminRides,
  apiCreateRide,
  apiUpdateRide,
  apiCancelRide,
  apiGetRideById
} from '../../api/axiosInstance.js';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useModal } from '../../hooks/useModal.js';
import { formatDateTime } from '../../utils/dateUtils.js';
import '../../styles/manage-rides.css';

export default function ManageRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);
  const { showToast } = useToast();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  useEffect(() => {
    loadRides();
  }, [page]);

  async function loadRides() {
    try {
      setLoading(true);
      const data = await apiGetAdminRides({ page, size });
      setRides(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      showToast('Failed to load rides', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload) {
    try {
      await apiCreateRide(payload);
      showToast('Ride created successfully', 'success');
      closeModal();
      await loadRides();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to create ride', 'error');
      throw err; // Re-throw so form can handle it
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await apiUpdateRide(id, payload);
      showToast('Ride updated successfully', 'success');
      closeModal();
      await loadRides();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update ride', 'error');
      throw err; // Re-throw so form can handle it
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this ride? All bookings will be cancelled.')) {
      return;
    }
    try {
      await apiCancelRide(id);
      showToast('Ride cancelled successfully', 'success');
      loadRides();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to cancel ride', 'error');
    }
  }

  async function handleEdit(id) {
    try {
      const ride = await apiGetRideById(id);
      openModal({ type: 'edit', ride });
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to load ride details', 'error');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Rides</h1>
        <p className="page-subtitle">Create, update, and cancel rides</p>
        <button className="btn primary" onClick={() => openModal({ type: 'create' })}>
          + Create Ride
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : rides.length === 0 ? (
        <EmptyState
          icon="🚌"
          title="No Rides"
          message="Create your first ride to get started"
          action={
            <button className="btn primary" onClick={() => openModal({ type: 'create' })}>
              Create Ride
            </button>
          }
        />
      ) : (
        <>
          <div className="rides-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Date & Time</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id}>
                    <td>{ride.id}</td>
                    <td>{ride.sourceLocation}</td>
                    <td>{ride.destinationLocation}</td>
                    <td>{formatDateTime(ride.rideDateTime)}</td>
                    <td>
                      {ride.availableSeats} / {ride.totalSeats}
                    </td>
                    <td>
                      <StatusBadge status={ride.status} />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          type="button"
                          className="btn-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(ride.id);
                          }}
                        >
                          Edit
                        </button>
                        {ride.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            className="btn-link danger"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCancel(ride.id);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
        </>
      )}

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalData?.type === 'create' ? 'Create Ride' : 'Edit Ride'}
        >
          <RideForm
            ride={modalData?.ride}
            onSubmit={modalData?.type === 'create' ? handleCreate : (payload) => handleUpdate(modalData.ride.id, payload)}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}

function RideForm({ ride, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    sourceLocation: ride?.sourceLocation || '',
    destinationLocation: ride?.destinationLocation || '',
    rideDateTime: ride?.rideDateTime ? new Date(ride.rideDateTime).toISOString().slice(0, 16) : '',
    totalSeats: ride?.totalSeats || 4
  });
  const [submitting, setSubmitting] = useState(false);

  // Reset form when ride changes
  React.useEffect(() => {
    if (ride) {
      setFormData({
        sourceLocation: ride.sourceLocation || '',
        destinationLocation: ride.destinationLocation || '',
        rideDateTime: ride.rideDateTime ? new Date(ride.rideDateTime).toISOString().slice(0, 16) : '',
        totalSeats: ride.totalSeats || 4
      });
    } else {
      setFormData({
        sourceLocation: '',
        destinationLocation: '',
        rideDateTime: '',
        totalSeats: 4
      });
    }
  }, [ride]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        rideDateTime: new Date(formData.rideDateTime).toISOString()
      });
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ride-form">
      <div className="form-group">
        <label>Source Location</label>
        <input
          type="text"
          required
          value={formData.sourceLocation}
          onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Destination Location</label>
        <input
          type="text"
          required
          value={formData.destinationLocation}
          onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Date & Time</label>
        <input
          type="datetime-local"
          required
          value={formData.rideDateTime}
          onChange={(e) => setFormData({ ...formData, rideDateTime: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Total Seats</label>
        <input
          type="number"
          min="1"
          required
          value={formData.totalSeats}
          onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn subtle" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'Saving...' : ride ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
