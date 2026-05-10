import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request Interceptor: Tambahkan Token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Deteksi Token Expired (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika error adalah 401 (Unauthorized) atau 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Session Expired or Unauthorized. Logging out...");
      
      // Bersihkan data login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      // Redirect ke login hanya jika kita tidak sedang di halaman login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
