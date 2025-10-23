const TOKEN_KEY = 'ju_token';

export function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch (e) { console.warn('setToken failed', e); }
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
}
