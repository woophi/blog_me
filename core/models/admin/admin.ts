import { FileItem } from './files';

export type AdminState = {
  section: Section;
  files: FileItem[];
  selectedFile: FileItem;
  uploadingFile: boolean;
  uploadFailed: boolean;
};

export enum Section {
  Albums = 'Albums',
  Blogs = 'Blogs',
  Files = 'Files',
  Slider = 'Slider',
  Bio = 'Bio',
  Photos = 'Photos',
  BlackList = 'BlackList',
  Youtube = 'Youtube',
  Comments = 'Comments',
  Facebook = 'Facebook',
  Likes = 'Likes',
  Sketch = 'Sketch',
  Followers = 'Followers',
  Users = 'Users'
}
