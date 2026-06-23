const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = (options) => {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers
    };
    
    // Set default Content-Type if body is not FormData
    if (!(options.body instanceof FormData)) {
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
    } else {
        // If it's FormData, remove Content-Type so browser can set boundary
        delete headers['Content-Type'];
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export const apiFetch = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const finalOptions = {
        ...options,
        headers: getHeaders(options)
    };

    const response = await fetch(url, finalOptions);
    return response;
};

export default apiFetch;
