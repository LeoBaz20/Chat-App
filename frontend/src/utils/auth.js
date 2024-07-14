import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserFromToken = () => {
  const token = getToken();
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

export const decodeToken = (token) => {
    return jwtDecode(token);
  };

export const logout = () => {
  localStorage.removeItem('token');
};
