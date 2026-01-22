// frontend/utils/apiService.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:4000';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiService.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiService.interceptors.response.use(
  (response) => response, 
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail');
        
        toast.error('Session expired. Please login again.');
        
        
        window.location.href = '/';
      }
    } else if (status === 500) {
      toast.error('Internal Server Error. Please try again later.');
    } else {
      
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default apiService;
