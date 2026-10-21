import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Dynamically detect host IP address from Expo bundler, or fallback to current local IP
const debuggerHost = 
  Constants.expoConfig?.hostUri || 
  Constants.manifest2?.extra?.expoGo?.debuggerHost || 
  Constants.manifest?.debuggerHost;

const hostIp = debuggerHost ? debuggerHost.split(':')[0] : '192.168.1.33';
export const DEFAULT_BASE_URL = `http://${hostIp}:8000/api`;
export let BASE_URL = DEFAULT_BASE_URL;

export const getBaseUrl = async () => {
  try {
    const custom = await AsyncStorage.getItem('custom_backend_url');
    if (custom && custom.trim().length > 0) {
      BASE_URL = custom.trim().replace(/\/+$/, '');
      return BASE_URL;
    }
  } catch (e) {
    console.warn('Failed to read custom_backend_url:', e);
  }
  BASE_URL = DEFAULT_BASE_URL;
  return DEFAULT_BASE_URL;
};

export const setCustomBaseUrl = async (url) => {
  if (!url || !url.trim()) {
    await AsyncStorage.removeItem('custom_backend_url');
    BASE_URL = DEFAULT_BASE_URL;
    return DEFAULT_BASE_URL;
  }
  const clean = url.trim().replace(/\/+$/, '');
  await AsyncStorage.setItem('custom_backend_url', clean);
  BASE_URL = clean;
  return clean;
};

export const testServerConnection = async (overrideUrl = null) => {
  try {
    const activeUrl = overrideUrl || (await getBaseUrl());
    const rootUrl = activeUrl.replace(/\/api\/?$/, '');
    console.log(`[Ping Test] Testing connection to ${rootUrl}/`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${rootUrl}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const text = await response.text();
    return { 
      ok: response.ok, 
      status: response.status, 
      url: rootUrl,
      message: text.trim() || 'Backend connected successfully!' 
    };
  } catch (error) {
    return { 
      ok: false, 
      error: error.message || 'Connection failed',
      url: overrideUrl || BASE_URL,
    };
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const currentBaseUrl = await getBaseUrl();
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${currentBaseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const token = await AsyncStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    console.log(`[API Request] ${options.method || 'GET'} -> ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.warn(`[API Non-OK] ${response.status} from ${url}:`, data);
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`[API Fetch Error] Failed connecting to ${url}:`, error.message);
    return { 
      ok: false, 
      status: 500, 
      error: `Could not connect to ${url}.\n\nError: ${error.message}` 
    };
  }
};

export default apiFetch;
