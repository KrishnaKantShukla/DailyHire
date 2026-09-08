import { getToken } from './auth';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';



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

async function parseJsonResponse(response, defaultErrorMsg = 'API request failed.') {
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    }
    const rawText = await response.text().catch(() => '');
    const cleanMsg = rawText.replace(/<[^>]*>?/gm, '').trim();
    throw new Error(cleanMsg ? `Server Error (${response.status}): ${cleanMsg.slice(0, 150)}` : defaultErrorMsg);
  }

  if (data !== null) return data;

  try {
    return await response.json();
  } catch (err) {
    throw new Error(defaultErrorMsg);
  }
}

export async function fetchHelpers(params = {}) {
  const response = await fetch(buildUrl('/api/helpers', params), {
    headers: getHeaders(),
  });
  return parseJsonResponse(response, 'Failed to load helpers.');
}

export async function fetchHelper(id) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/helpers/${id}`, {
    headers: getHeaders(),
  });
  return parseJsonResponse(response, 'Failed to load helper details.');
}

export async function fetchServices() {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/services`, {
    headers: getHeaders(),
  });
  return parseJsonResponse(response, 'Failed to load services.');
}

export async function signupUser(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(response, 'Signup failed.');
}

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(response, 'Login failed.');
}

export async function loginWithGoogle(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/google`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(response, 'Google authentication failed.');
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

// ─── Admin Panel API Integrations ───────────────────────────────────────────

export async function fetchAdminStats() {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load admin dashboard statistics.');
  }
  return response.json();
}

export async function fetchAdminHelpers(status = '') {
  const url = buildUrl('/api/admin/helpers', status ? { status } : {});
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to load worker management registry.');
  }
  return response.json();
}

export async function verifyWorker(id, status, notes = '') {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/helpers/${id}/verify`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status, notes }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update worker verification status.');
  }
  return data;
}

export async function deleteWorker(id) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/helpers/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete worker profile.');
  }
  return data;
}

export async function fetchAdminUsers() {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/users`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user directory.');
  }
  return response.json();
}

export async function deleteAdminUser(id) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user.');
  }
  return data;
}

export async function fetchAdminBookings() {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/bookings`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bookings list.');
  }
  return response.json();
}

export async function createAdminWorker(payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/helpers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create worker profile.');
  }
  return data;
}

export async function updateAdminWorker(id, payload) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/helpers/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update worker details.');
  }
  return data;
}

export async function updateAdminBookingStatus(id, status) {
  const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/admin/bookings/${id}/status`, {
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




