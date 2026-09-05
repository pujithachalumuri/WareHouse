const STORAGE_USER = 'sw_user';
const STORAGE_TOKEN = 'sw_token';

export function saveAuth(user, token) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_TOKEN, token);
}
export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USER)); } catch { return null; }
}
export function getToken() {
  return localStorage.getItem(STORAGE_TOKEN);
}
export function clearAuth() {
  localStorage.removeItem(STORAGE_USER);
  localStorage.removeItem(STORAGE_TOKEN);
}
