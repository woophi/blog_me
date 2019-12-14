export type BlogGuestItem = {
  title: string; 
  coverPhotoUrl: string; 
  publishedDate: Date; 
  blogId: number;
  shortText: string;
}

export type BlogGuest = BlogGuestItem & {
  body: string;
  comments: number;
  liked: boolean;
  updatedAt: Date
};