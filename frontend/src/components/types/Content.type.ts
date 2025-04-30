export type Article = {
  id: number;
  type: string;
  title: string;
  content: string;
  editing_status: string;
  thumbnail: string;
  user_has_liked: boolean;
  total_likes: number;
  author: {
    id: number;
    username: string;
    full_name: string;
  };
  posting_date: string;
  tags: { id: string, tag: string }[];
};


export type Video = {
  title: string;
  type: string;
  thumbnail: string;
  url: string;
  upload_date: string;
}

