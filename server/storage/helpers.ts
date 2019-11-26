import { resolve } from 'path';

export const getFilePath = (fileName: string) =>
  resolve(__dirname, 'temp', fileName);
