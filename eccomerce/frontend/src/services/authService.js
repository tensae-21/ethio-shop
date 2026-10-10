import API from './api';

export const hasValidSession = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) return false;

  try {
    const encodedPayload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!encodedPayload) return false;
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  localStorage.setItem('app_user', JSON.stringify(response.data.user));
  return response.data;
};

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('app_user');
  localStorage.removeItem('tokenExpiry');
};