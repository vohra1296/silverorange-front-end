export type Repo = {
  id: number;
  name: string;
  description: string;
  language: string;
  forksCount: number;
  owner: Owner;
  commitUrl: string;
  createdAt: string;
};

export type Owner = {
  author: string;
  message: string;
  commitDate: string;
};
