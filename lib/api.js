import { getToken } from './auth';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const buildUrl = (path, params = {}) => {
  const base = API_BASE.replace(/\/+$/, '');
  const url = new URL(`${base}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
};

export async function fetchHelpers(params = {}) {
  const response = await fetch(buildUrl('/api/helpers', params), {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load helpers.');
  }
  return response.json();
}

export async function fetchHelper(id) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/helpers/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load helper details.');
  }
  return response.json();
}

export async function fetchServices() {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/services`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load services.');
  }
  return response.json();
}

export async function signupUser(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed.');
  }
  return data;
}

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed.');
  }
  return data;
}

export async function loginWithGoogle(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/google`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Google authentication failed.');
  }
  return data;
}

export async function createBooking(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Booking failed.');
  }
  return data;
}

export async function fetchBookings(params = {}) {
  const response = await fetch(buildUrl('/api/bookings', params), {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load bookings.');
  }
  return response.json();
}

export async function updateBookingStatus(id, status) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update booking status.');
  }
  return data;
}

export async function fetchReviews(helperId) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/reviews/${helperId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load reviews.');
  }
  return response.json();
}

export async function createReview(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/reviews`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit review.');
  }
  return data;
}


