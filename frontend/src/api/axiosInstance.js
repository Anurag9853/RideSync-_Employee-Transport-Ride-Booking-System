import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function setupAuthInterceptors({ getToken, onUnauthorized }) {
  axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        onUnauthorized?.();
      }
      return Promise.reject(error);
    }
  );
}

// -----------------------------
// API functions (kept here to
// keep API logic inside /api)
// -----------------------------

export async function apiRegister(payload) {
  const res = await axiosInstance.post('/auth/register', payload);
  return res.data;
}

export async function apiLogin(payload) {
  const res = await axiosInstance.post('/auth/login', payload);
  return res.data;
}

export async function apiGetRides({ page = 0, size = 10, source = '', destination = '' } = {}) {
  const res = await axiosInstance.get('/rides', {
    params: {
      page,
      size,
      ...(source ? { source } : {}),
      ...(destination ? { destination } : {})
    }
  });
  return res.data;
}

/**
 * Book a ride. Backend expects: POST /rides/{rideId}/book (no body).
 */
export async function apiBookRide(rideId) {
  const res = await axiosInstance.post(`/rides/${rideId}/book`);
  return res.data;
}

export async function apiGetMyBookings() {
  const res = await axiosInstance.get('/bookings/my');
  return res.data;
}

export async function apiCancelBooking(bookingId) {
  const res = await axiosInstance.delete(`/bookings/${bookingId}`);
  return res.data;
}

// Admin APIs
export async function apiGetDashboardStats() {
  const res = await axiosInstance.get('/admin/dashboard/stats');
  return res.data;
}

export async function apiGetAllUsers({ page = 0, size = 10, sortBy = 'name' } = {}) {
  const res = await axiosInstance.get('/admin/users', {
    params: { page, size, sortBy }
  });
  return res.data;
}

export async function apiDeleteUser(userId) {
  const res = await axiosInstance.delete(`/admin/users/${userId}`);
  return res.data;
}

export async function apiGetAllBookings({ page = 0, size = 10, sortBy = 'bookingTime' } = {}) {
  const res = await axiosInstance.get('/admin/bookings', {
    params: { page, size, sortBy }
  });
  return res.data;
}

export async function apiCancelBookingByAdmin(bookingId) {
  const res = await axiosInstance.delete(`/admin/bookings/${bookingId}`);
  return res.data;
}

export async function apiGetAdminRides({ page = 0, size = 10, sortBy = 'rideDateTime' } = {}) {
  const res = await axiosInstance.get('/admin/rides', {
    params: { page, size, sortBy }
  });
  return res.data;
}

export async function apiGetRideById(rideId) {
  const res = await axiosInstance.get(`/admin/rides/${rideId}`);
  return res.data;
}

export async function apiCreateRide(payload) {
  const res = await axiosInstance.post('/admin/rides', payload);
  return res.data;
}

export async function apiUpdateRide(rideId, payload) {
  const res = await axiosInstance.put(`/admin/rides/${rideId}`, payload);
  return res.data;
}

export async function apiCancelRide(rideId) {
  const res = await axiosInstance.delete(`/admin/rides/${rideId}`);
  return res.data;
}
