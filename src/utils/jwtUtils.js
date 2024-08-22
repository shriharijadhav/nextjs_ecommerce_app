// utils/jwtUtils.js
import {jwtDecode} from 'jwt-decode';

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    console.log(decoded)
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
};
