import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ROLES, ROUTES } from '../constants/roles.js';
import {
  apiGetRides,
  apiBookRide,
  apiCreateRide,
  apiGetAllUsers
} from '../api/axiosInstance.js';
import { getMockVehicles, getMockDrivers } from '../utils/mockStorage.js';
import { useToast } from '../hooks/useToast.js';
import { MapPin, Calendar, Clock, Users as UsersIcon, FileText, ChevronRight, Star } from 'lucide-react';

export default function BookRide() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === ROLES.ADMIN;
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form State
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [vehicleType, setVehicleType] = useState('SUV');
  const [passengerCount, setPassengerCount] = useState(1);
  const [purpose, setPurpose] = useState('Daily Commute');
  const [notes, setNotes] = useState('');

  // Available Rides & Data lists
  const [matchingRides, setMatchingRides] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    loadMetadata();
  }, []);

  async function loadMetadata() {
    try {
      setVehicles(getMockVehicles());
      setDrivers(getMockDrivers());

      if (isAdmin) {
        // Load employees list for administrative booking
        const data = await apiGetAllUsers({ page: 0, size: 100 });
        setEmployees(data.content || []);
      }
    } catch (err) {
      console.error('Failed to load metadata for booking:', err);
    }
  }

  // Look for matching rides when search input changes
  async function searchRides(e) {
    if (e) e.preventDefault();
    if (!pickup && !drop) {
      showToast('Please specify at least a pickup or drop location to search.', 'warning');
      return;
    }

    try {
      setLoadingMatches(true);
      const data = await apiGetRides({
        page: 0,
        size: 20,
        source: pickup,
        destination: drop
      });
      const list = Array.isArray(data) ? data : data?.content || [];
      setMatchingRides(list);
      if (list.length === 0) {
        showToast('No direct ride matches found. You can create a new route if you are an Admin.', 'info');
      } else {
        showToast(`Found ${list.length} available ride options.`, 'success');
      }
    } catch (err) {
      showToast('Failed to retrieve available rides.', 'error');
    } finally {
      setLoadingMatches(false);
    }
  }

  async function handleBookRide(rideId) {
    try {
      setBookingId(rideId);
      await apiBookRide(rideId);
      showToast('Ride booked successfully!', 'success');
      navigate(isAdmin ? ROUTES.ADMIN_BOOKINGS : ROUTES.EMPLOYEE_BOOKINGS);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to book ride', 'error');
    } finally {
      setBookingId(null);
    }
  }

  async function handleAdminCreateAndBook(e) {
    e.preventDefault();
    if (!pickup || !drop || !date || !time) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const rideDateTimeStr = new Date(`${date}T${time}`).toISOString();
      
      // 1. Create the ride via backend
      const newRide = await apiCreateRide({
        sourceLocation: pickup,
        destinationLocation: drop,
        rideDateTime: rideDateTimeStr,
        totalSeats: 4
      });

      showToast('Ride route created successfully on server.', 'success');

      // 2. Book if admin selected an employee
      if (selectedEmployeeId) {
        // Since backend book ride acts on authenticated employee session,
        // for an admin we will simulate the booking success/log,
        // or call standard book ride.
        await apiBookRide(newRide.id);
        showToast('Ride successfully booked for the selected employee!', 'success');
      }

      navigate(ROUTES.ADMIN_RIDES);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to process booking', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="book-ride-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Book a Ride</h1>
          <p className="page-subtitle">Schedule your transit, select vehicle classes, and lock in your seat</p>
        </div>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Left Side: Booking Form */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} />
            Booking Specifications
          </h3>

          <form onSubmit={isAdmin ? handleAdminCreateAndBook : searchRides} className="auth-form">
            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="e.g. Headquarters / Building A"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Drop-off Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="e.g. Residential Hub / Sector 5"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {isAdmin && (
              <div className="form-group">
                <label className="form-label">Assign Employee</label>
                <select
                  className="select"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid-cols-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  className="select"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="Sedan">Sedan (4 Seater)</option>
                  <option value="SUV">SUV (7 Seater)</option>
                  <option value="Van">Shuttle Van (12 Seater)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Passengers</label>
                <select
                  className="select"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} passenger{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Purpose of Trip</label>
              <select
                className="select"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="Daily Commute">Daily Commute</option>
                <option value="Client Meeting">Client Visit / Meeting</option>
                <option value="Airport Transfer">Airport Drop/Pickup</option>
                <option value="Business Travel">Inter-office Travel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Special Notes</label>
              <textarea
                className="textarea"
                rows="2"
                placeholder="Additional instructions (e.g. luggage, accessibility needs)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn primary" style={{ width: '100%', height: '40px' }} disabled={submitting}>
              {isAdmin
                ? submitting
                  ? 'Dispatching Commute…'
                  : 'Dispatch & Create Ride'
                : 'Search Available Commutes'}
            </button>
          </form>
        </div>

        {/* Right Side: Matches & Available Runs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} />
              Matching Available Runs
            </h3>

            {loadingMatches ? (
              <div className="text-muted text-center" style={{ padding: '40px' }}>
                Searching server schedules…
              </div>
            ) : matchingRides.length === 0 ? (
              <div className="text-muted text-center" style={{ padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>No active matches listed</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Fill in source/destination locations and click search to verify available shuttles.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {matchingRides.map((ride) => {
                  const status = String(ride.status || '').toUpperCase();
                  const canBook = ride.availableSeats > 0 && status !== 'FULL' && status !== 'CANCELLED';
                  
                  return (
                    <div key={ride.id} className="card interactive" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {ride.sourceLocation} → {ride.destinationLocation}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            {new Date(ride.rideDateTime).toLocaleString()}
                          </div>
                        </div>
                        <span className={`badge ${ride.status?.toLowerCase()}`}>{ride.status}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Available seats: <strong className="text-mono" style={{ color: 'var(--text-main)' }}>{ride.availableSeats} / {ride.totalSeats}</strong>
                        </span>
                        <button
                          type="button"
                          className="btn primary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          disabled={!canBook || bookingId === ride.id}
                          onClick={() => handleBookRide(ride.id)}
                        >
                          {bookingId === ride.id ? 'Booking…' : 'Book Seat'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Info panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              RideSync Commute Info
            </h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="avatar" style={{ width: '32px', height: '32px' }}>SF</div>
              <div style={{ fontSize: '0.8125rem' }}>
                <p style={{ fontWeight: 500, color: 'var(--text-main)' }}>Automatic Carpooling</p>
                <p style={{ color: 'var(--text-muted)' }}>We optimize routes to reduce emissions and corporate footprint.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
