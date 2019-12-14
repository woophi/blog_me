import { client } from 'core/callbacks';
import { store } from 'core/store';
import { getCommentById } from 'core/operations';

client.welcome = () => {
  console.warn('welcome uniq guest');
};

client.upload_done = (fileName, fileId, url) => {
  console.warn(fileName, 'fileName', 'fileId', fileId);
  if (fileId) {
    const file = {
      _id: fileId,
      name: fileName,
      url
    };
    store.dispatch({ type: 'UPDATE_FILES', payload: file });
    store.dispatch({ type: 'SELECT_FILE', payload: file });
  }
  store.dispatch({ type: 'UPLOADING_FILE', payload: false });
};

client.new_comment = async commentId => {
  const comment = await getCommentById(commentId);
  if (comment) {
    store.dispatch({
      type: 'UPDATE_COMMENTS',
      payload: { comment }
    });
  }
};
