import axios from 'axios';
import { RawDraftContentState } from 'draft-js';
import { BASE_URL } from "../../Config";


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
  return api.get(getPublicOnly ? '/articles/' : '/articles/?public_only=false')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export const postArticle = async (payload: { title: string, content: RawDraftContentState, thumbnail: any }) => {
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


export const changeVisibility = async (changedArticles: Record<number, boolean>) => {
  api.post("/articles/change-visibility", changedArticles)
  .then(response => {
    if (response.status !== 200) {
      throw "Request failed! Contact an admin.";
    }
  })
  .catch(err => {
    throw err;
  })
}


export const getVideos = async (livestreams: boolean) => {
  return api.get(`/videos/?livestreams=${livestreams}`)
  .then(response => {
    if (response.status !== 200) {
      throw "Request failed! Contact an admin.";
    }
    return response.data;
  })
  .catch(err => {
    throw err;
  })
}


export const sendEmail = async (payload: any) => {
  api.post("/contact", payload)
  .then(res => {
    if (res.status !== 200) {
      throw new Error(`Error: ${res.status}`)
    }
    return true;
  })
  .catch(err => {return false})
}


export default api;
