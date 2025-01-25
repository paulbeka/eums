export type Article = {
  id: number;
  title: string;
  content: string;
  public: boolean;
  thumbnail: string;
  tags: string[]
};


export type Video = {
  title: string;
  thumbnail: string;
  url: string;
}

