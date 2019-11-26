import * as fs from 'fs';
import { FileArray, UploadedFile } from 'express-fileupload';
import { EventBus } from '../lib/events';
import { FStorageEvents } from './types';
import { Logger } from '../logger';
import { getFilePath } from './helpers';
import { agenda } from 'server/lib/agenda';

export class Storage {
  constructor(
    protected files: FileArray,
    protected job?: string
  ) {
    Logger.debug('Storage init');
    this.upload();
    if (job) {
      this.createJob();
    }
  }

  private fileNames = Object.keys(this.files);
  private upload = () => {
    this.fileNames.forEach(fileName => {
      const file = this.files[fileName] as UploadedFile;
      const path = getFilePath(fileName);
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, file.data);
      }
    });
  };

  private createJob = () => {
    agenda.define(this.job, (job, done) => {
      this.uploadFilesToCloudinary(done);
    });
  };

  private uploadFilesToCloudinary = (done: (err?: Error) => void) => {
    this.fileNames.forEach(fileName => {
      Logger.debug('Storage process -> ' + FStorageEvents.CLOUDINARY_ASK);
      EventBus.emit(FStorageEvents.CLOUDINARY_ASK, { fileName, done });
    });
  }

  performQueue = () => {
    agenda.now(this.job);
  };
}
