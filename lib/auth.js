const USER_KEY = 'dailyhire_user';
const TOKEN_KEY = 'dailyhire_token';

/**
 * Returns the current logged-in user object, or null if not logged in.
 */
export function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Returns the saved auth token, or null if none is stored.
 */
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Saves a user object and token to localStorage.
 */
export function setUser(userData, token) {
  if (typeof window === 'undefined') return;
  const userId = userData.id || userData._id || userData.userId || '';
  const normalizedUser = {
    ...userData,
    id: userId,
    _id: userId,
    accountType: userData.accountType || userData.role || 'customer',
  };
  localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Clears the current user session.
 */
export function clearUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
