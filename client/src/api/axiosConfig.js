import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hostel-management-system-t8qs.onrender.com/api', // Replace with production URL later
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT Auth Token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo.token) {
        config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
