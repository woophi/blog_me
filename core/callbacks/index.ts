import { clientPerformCallback } from 'core/socket';

export const client = clientPerformCallback(m => ({
  welcome: m<() => void>(),
  upload_done: m<(fileName: string, fileId?: string, url?: string) => void>(),
  new_comment: m<(commentId: string) => void>()
}));
