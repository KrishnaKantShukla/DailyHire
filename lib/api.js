export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
  const response = await fetch(buildUrl('/api/helpers', params));
  if (!response.ok) {
    throw new Error('Failed to load helpers.');
  }
  return response.json();
}

export async function fetchHelper(id) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/helpers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to load helper details.');
  }
  return response.json();
}

export async function fetchServices() {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/services`);
  if (!response.ok) {
    throw new Error('Failed to load services.');
  }
  return response.json();
}

export async function signupUser(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed.');
  }
  return data;
}

export async function createBooking(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Booking failed.');
  }
  return data;
}
