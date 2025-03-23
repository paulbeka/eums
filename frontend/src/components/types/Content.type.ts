export type Article = {
  id: number;
  title: string;
  content: string;
  public: boolean;
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
  thumbnail: string;
  url: string;
  upload_date: string;
}

