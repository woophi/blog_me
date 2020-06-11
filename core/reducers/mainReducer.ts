import * as models from 'core/models';
import * as admin from 'core/models/admin';

export const initialState: models.AppState['ui'] = {
  user: {
    name: '',
    roles: [],
    token: '',
    userId: '',
    fetching: true,
    email: ''
  },
  admin: {
    section: admin.Section.Albums,
    files: [],
    selectedFile: null,
    uploadingFile: false,
    facebookActive: false,
    uploadFailed: false,
  },
  comments: [],
  replies: [],
  searchResults: [],
  searchQuery: '',
  searchStatus: models.SearchStatus.init,
  quiz: null,
};

export const reducer = (
  state = initialState,
  dispatch: models.AppDispatch
): models.AppState['ui'] => {
  switch (dispatch.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: dispatch.payload,
      };
    }
    case 'SET_COMMENTS': {
      return {
        ...state,
        comments: dispatch.payload.comments,
      };
    }
    case 'LOAD_MORE_COMMENTS': {
      return {
        ...state,
        comments: [...state.comments, ...dispatch.payload.comments],
      };
    }
    case 'UPDATE_COMMENTS': {
      return {
        ...state,
        comments: [...state.comments, dispatch.payload.comment],
      };
    }
    case 'UPDATE_COMMENT_REPLIES': {
      return {
        ...state,
        comments: state.comments.map((c) =>
          c._id == dispatch.payload.commentId
            ? {
                ...c,
                replies: [...c.replies, ...dispatch.payload.replies],
              }
            : c
        ),
      };
    }
    case 'SET_REPLIES': {
      return {
        ...state,
        replies: dispatch.payload.replies,
      };
    }
    case 'LOAD_MORE_REPLIES': {
      return {
        ...state,
        replies: [...state.replies, ...dispatch.payload.replies],
      };
    }
    case 'UPDATE_REPLIES': {
      return {
        ...state,
        replies: [...state.replies, dispatch.payload.reply],
      };
    }

    case 'SET_USER_TOKEN': {
      return {
        ...state,
        user: {
          ...state.user,
          token: dispatch.payload,
        },
      };
    }
    case 'SET_USER_FETCHING': {
      return {
        ...state,
        user: {
          ...state.user,
          fetching: dispatch.payload,
        },
      };
    }
    case 'FETCH_FILES': {
      return {
        ...state,
        admin: {
          ...state.admin,
          files: dispatch.payload,
        },
      };
    }
    case 'UPDATE_FILES': {
      return {
        ...state,
        admin: {
          ...state.admin,
          files: [dispatch.payload, ...state.admin.files],
        },
      };
    }
    case 'SELECT_FILE': {
      return {
        ...state,
        admin: {
          ...state.admin,
          selectedFile: dispatch.payload,
        },
      };
    }
    case 'UPLOADING_FILE': {
      return {
        ...state,
        admin: {
          ...state.admin,
          uploadingFile: dispatch.payload,
        },
      };
    }
    case 'UPLOAD_FAILED': {
      return {
        ...state,
        admin: {
          ...state.admin,
          uploadFailed: dispatch.payload,
        },
      };
    }
    case 'UPDATE_FACEBOOK_ACTIVE': {
      return {
        ...state,
        admin: {
          ...state.admin,
          facebookActive: dispatch.payload,
        },
      };
    }

    case 'SET_SEARCH_RESULTS': {
      return {
        ...state,
        searchResults: dispatch.payload,
        searchStatus: models.SearchStatus.init,
      };
    }
    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: dispatch.payload,
      };
    }
    case 'SET_SEARCH_STATUS': {
      return {
        ...state,
        searchStatus: dispatch.payload,
      };
    }

    case 'SET_QUIZ': {
      return {
        ...state,
        quiz: dispatch.payload,
      };
    }
    case 'UPDATE_QUIZ': {
      return {
        ...state,
        quiz: {
          ...state.quiz,
          ...dispatch.payload,
        },
      };
    }
    case 'UPDATE_QUIZ_PARTICIPANT': {
      if (dispatch.payload === null) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        quiz: {
          ...state.quiz,
          participationHistory: {
            ...state.quiz.participationHistory,
            ...dispatch.payload,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
};
