import { CommentItem } from './comment';
import { AuthData } from './auth';
import { AdminState, FileItem } from './admin';
import { BlogGuestItem, SearchStatus } from './blog';

export type AppState = {
  ui: {
    user: AuthData;
    admin: AdminState;
    comments: CommentItem[];
    replies: CommentItem[];
    searchResults: BlogGuestItem[];
    searchQuery: string;
    searchStatus: SearchStatus;
  };
};

export type AppDispatch =
  | SetUserDispatch
  | { type: 'SET_USER_TOKEN'; payload: AppState['ui']['user']['token'] }
  | { type: 'SET_USER_FETCHING'; payload: AppState['ui']['user']['fetching'] }
  //comments
  | { type: 'UPDATE_COMMENTS'; payload: { comment: CommentItem } }
  | {
      type: 'UPDATE_COMMENT_REPLIES';
      payload: { commentId: string; replies: string[] };
    }
  | {
      type: 'LOAD_MORE_COMMENTS';
      payload: { comments: CommentItem[] };
    }
  | { type: 'SET_COMMENTS'; payload: { comments: CommentItem[] } }
  //replies
  | { type: 'UPDATE_REPLIES'; payload: { reply: CommentItem } }
  | {
      type: 'LOAD_MORE_REPLIES';
      payload: { replies: CommentItem[] };
    }
  | { type: 'SET_REPLIES'; payload: { replies: CommentItem[] } }
  // files admin
  | { type: 'FETCH_FILES'; payload: AdminState['files'] }
  | { type: 'UPDATE_FILES'; payload: FileItem }
  | { type: 'SELECT_FILE'; payload: FileItem }
  | { type: 'UPLOADING_FILE'; payload: AdminState['uploadingFile'] }
  | { type: 'UPLOAD_FAILED'; payload: AdminState['uploadFailed'] }
  | { type: 'UPDATE_FACEBOOK_ACTIVE'; payload: AdminState['facebookActive'] }
  | SetSearchResultsDispatch
  | SetSearchQueryDispatch
  | SetSearchStatusDispatch;

export type SetUserDispatch = { type: 'SET_USER'; payload: AppState['ui']['user'] };

export type SetSearchResultsDispatch = {
  type: 'SET_SEARCH_RESULTS';
  payload: AppState['ui']['searchResults'];
};
export type SetSearchQueryDispatch = {
  type: 'SET_SEARCH_QUERY';
  payload: AppState['ui']['searchQuery'];
};
export type SetSearchStatusDispatch = {
  type: 'SET_SEARCH_STATUS';
  payload: AppState['ui']['searchStatus'];
};
