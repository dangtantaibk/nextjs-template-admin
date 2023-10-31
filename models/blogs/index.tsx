export interface BlogsDetailProp {
  author: number;
  content: string | null;
  createdAt: number;
  id: number;
  publishedDate: number;
  shortDesc: string;
  status: number;
  title: string;
  updatedAt: number;
  url?: string;
  backgroundUrl?: string | null;
}
