import { useNavigate } from "react-router-dom";
import api from "../api/Api";

export const likeArticle = (articleId: number) => {
  return api
    .post(`/like/${articleId}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      throw "Error liking article:" + error;
    });
}