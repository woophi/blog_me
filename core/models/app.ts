import { CommentItem } from './comment';
import { AuthData } from './auth';
import { AdminState, FileItem } from './admin';

export type AppState = {
  ui: {
    user: AuthData;
    admin: AdminState;
    comments: {
      blogId: number;
      comments: CommentItem[];
    }[];
  };
};

export type AppDispatch =
  | { type: 'SET_USER'; payload: AppState['ui']['user'] }
  | { type: 'SET_USER_TOKEN'; payload: AppState['ui']['user']['token'] }
  | { type: 'SET_USER_FETCHING'; payload: AppState['ui']['user']['fetching'] }
  //comments
  | { type: 'UPDATE_COMMENTS'; payload: { blogId: number; comments: CommentItem[] } }
  | {
      type: 'LOAD_MORE_COMMENTS';
      payload: { blogId: number; comments: CommentItem[] };
    }
  | { type: 'SET_COMMENTS'; payload: { blogId: number; comments: CommentItem[] } }
  // files TODO: delete mbe
  | { type: 'FETCH_FILES'; payload: AdminState['files'] }
  | { type: 'UPDATE_FILES'; payload: FileItem }
  | { type: 'SELECT_FILE'; payload: FileItem }
  | { type: 'UPLOADING_FILE'; payload: AdminState['uploadingFile'] }
  | { type: 'UPDATE_FACEBOOK_ACTIVE'; payload: AdminState['facebookActive'] };
