// frontend/utils/apiService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000'; // আপনার ব্যাকএন্ডের বেস ইউআরএল

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// রিকোয়েস্ট পাঠানোর আগে টোকেন যোগ করার ইন্টারসেপ্টর
apiService.interceptors.request.use(
  (config) => {
    // নিশ্চিত করতে হবে যে কোডটি ক্লায়েন্ট সাইডে রান হচ্ছে (Hydration error এড়াতে)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('userToken');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;
