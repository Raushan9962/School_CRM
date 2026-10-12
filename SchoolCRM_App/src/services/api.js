import AsyncStorage from '@react-native-async-storage/async-storage';

// Your local machine IP for real device testing
export const BASE_URL = 'http://192.168.1.49:8000/api';

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API Fetch Error:', error);
    return { ok: false, status: 500, error: error.message || 'Network error' };
  }
};

export default apiFetch;
