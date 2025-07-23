import { jwtDecode } from 'jwt-decode';

export const formatArticleContent = (content: string) => {
  return content?.length ? content
    .replace(/\\u([a-fA-F0-9]{4})/g, (match, group) => 
      String.fromCharCode(parseInt(group, 16)) 
    )
    .replace(/(?:\\r\\n|\\r|\\n)/g, '<br>')
    .replace(/\\"/g, '"') : "";
}

export const getProfileName = () => {
    if (localStorage.getItem("access_token")) {
      return jwtDecode(localStorage.getItem("access_token")!)["sub"];
    }
    return false;
  }