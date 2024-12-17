import axios from 'axios';
import { RawDraftContentState } from 'draft-js';

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


export const getArticles = async (getPublicOnly: boolean) => {
  return api.get(`/articles/?public_only=${getPublicOnly}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export const postArticle = async (payload: { title: string, content: RawDraftContentState }) => {
  return api.post("/articles/", payload)
  .then(response => {
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  })
  .catch(err => {
    return false
  });
}


export const deleteArticle = async (articleId: number) => {
  return api.delete(`/article/${articleId}`)
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => {
      return false;
    });
}


export default api;
