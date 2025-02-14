export type Article = {
  id: number;
  title: string;
  content: string;
  public: boolean;
  thumbnail: string;
  tags: { id: string, tag: string }[];
};


export type Video = {
  title: string;
  thumbnail: string;
  url: string;
  upload_date: string;
}

