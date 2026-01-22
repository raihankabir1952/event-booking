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

// ১. রিকোয়েস্ট ইন্টারসেপ্টর: টোকেন যোগ করার জন্য
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

// ২. রেসপন্স ইন্টারসেপ্টর: গ্লোবাল এরর এবং ৪০১ হ্যান্ডেল করার জন্য
apiService.interceptors.response.use(
  (response) => response, // যদি রেসপন্স সফল হয় তবে সরাসরি রিটার্ন করবে
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // টোকেন ইনভ্যালিড বা এক্সপায়ার হলে
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail');
        
        toast.error('Session expired. Please login again.');
        
        // লগইন পেজে রিডাইরেক্ট (পেজ রিফ্রেশ করে ক্লিনআপ নিশ্চিত করা হচ্ছে)
        window.location.href = '/';
      }
    } else if (status === 500) {
      toast.error('Internal Server Error. Please try again later.');
    } else {
      // অন্যান্য এরর এর জন্য মেসেজ দেখানো (যদি থাকে)
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default apiService;
