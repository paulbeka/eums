import axios from 'axios';

// TODO: UPDATE THIS INTO .ENV FILE
const BASE_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getArticles = async () => {
  return api.get("/articles/")
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw error;
  });
}

export default api;
