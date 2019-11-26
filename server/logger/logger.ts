import * as fs from 'fs';
import { resolve } from 'path';
import config from '../config';

type Logger = {
  info: (msg: any, ...args: any) => void;
  debug: (msg: any, ...args: any) => void;
  error: (msg: any, ...args: any) => void;
};

const getDir = (file: string, dir: string = 'log') => {
  const rDir = resolve(__dirname, dir);
  const newDate = new Date();
  const pathLike = resolve(
    rDir,
    newDate.getFullYear() +
      '-' +
      (newDate.getMonth() + 1) +
      '-' +
      newDate.getDate() +
      '-' +
      file
  );
  try {
    if (!fs.existsSync(rDir)) {
      fs.mkdirSync(rDir);
      fs.appendFileSync(pathLike, '');
    }
  } catch (err) {
    console.error(err);
  }
  return fs.createWriteStream(pathLike);
};

const infoStream = getDir('info.txt');
const errorStream = getDir('error.txt');
const debugStream = getDir('debug.txt');

export const Logger: Logger = {
  info: (msg, ...rest) => {
    var message = new Date().toISOString() + ' : ' + msg + '\n';
    if (config.DEV_MODE) {
      infoStream.write(message);
    }
    console.log('\x1b[36m%s\x1b[0m', msg, ...rest);
  },
  debug: (msg, ...rest) => {
    var message = new Date().toISOString() + ' : ' + msg + '\n';
    if (config.DEV_MODE) {
      debugStream.write(message);
    }
    console.debug('\x1b[33m%s\x1b[0m', msg, ...rest);
  },
  error: (msg, ...rest) => {
    var message = new Date().toISOString() + ' : ' + msg + '\n';
    if (config.DEV_MODE) {
      errorStream.write(message);
    }
    console.trace('\x1b[41m%s\x1b[0m', 'ERROR ', msg, ...rest);
  }
};
