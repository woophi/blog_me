import * as models from 'core/models';

export const initialState: models.AppState['ui'] = {
  user: {
    name: '',
    roles: [],
    token: '',
    userId: '',
    fetching: true
  },
  admin: {
    section: models.Section.Albums,
    files: [],
    selectedFile: null,
    uploadingFile: false,
    facebookActive: false
  }
}

export const reducer = (state = initialState, dispatch: models.AppDispatch): models.AppState['ui'] => {
  switch (dispatch.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: dispatch.payload
      };
    }
    // FIXME:
    case 'SET_COMMENTS': {
      return {
        ...state
      };
    }
    case 'UPDATE_COMMENTS': {
      return {
        ...state
      };
    }

    case 'SET_USER_TOKEN': {
      return {
        ...state,
        user: {
          ...state.user,
          token: dispatch.payload
        }
      };
    }
    case 'SET_USER_FETCHING': {
      return {
        ...state,
        user: {
          ...state.user,
          fetching: dispatch.payload
        }
      };
    }
    case 'FETCH_FILES': {
      return {
        ...state,
        admin: {
          ...state.admin,
          files: dispatch.payload
        }
      };
    }
    case 'UPDATE_FILES': {
      return {
        ...state,
        admin: {
          ...state.admin,
          files: [ dispatch.payload, ...state.admin.files ]
        }
      };
    }
    case 'SELECT_FILE': {
      return {
        ...state,
        admin: {
          ...state.admin,
          selectedFile: dispatch.payload
        }
      };
    }
    case 'UPLOADING_FILE': {
      return {
        ...state,
        admin: {
          ...state.admin,
          uploadingFile: dispatch.payload
        }
      };
    }
    case 'UPDATE_FACEBOOK_ACTIVE': {
      return {
        ...state,
        admin: {
          ...state.admin,
          facebookActive: dispatch.payload
        }
      };
    }

    default: {
      return state
    }
  }
}
