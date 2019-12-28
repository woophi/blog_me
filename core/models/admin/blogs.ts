export type AdminBlogItem = {
  title: string;
  coverPhotoUrl: string;
  publishedDate: Date;
  blogId: number;
  shortText: string;
  draft: boolean;
}

export type BlogData = {
  title: string;
  coverPhotoUrl: string;
  publishedDate: string;
  shortText: string;
  draft: boolean;
  body: string;
  language?: string;
  time?: string;
};

export type FacebookPageItem = {
  pageId: number;
  pageName: string;
}