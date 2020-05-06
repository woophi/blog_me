import * as fs from 'fs';
import { FileArray, UploadedFile } from 'express-fileupload';
import { EventBus } from '../lib/events';
import { FStorageEvents } from './types';
import { Logger } from '../logger';
import { getFilePath } from './helpers';
import { agenda } from 'server/lib/agenda';

export class Storage {
  constructor(
    protected files?: FileArray,
    protected job?: string,
    protected url?: string
  ) {
    Logger.debug('Storage init');
    if (files) {
      this.upload();
    }
    if (job) {
      this.createJob();
    }
  }

  private fileNames = this.files ? Object.keys(this.files) : [];
  private upload = () => {
    this.fileNames.forEach((fileName) => {
      const file = this.files[fileName] as UploadedFile;
      const path = getFilePath(fileName);
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, file.data);
      }
    });
  };

  private createJob = () => {
    agenda.define(this.job, (job, done) => {
      if (this.url) {
        this.uploadFileURLToCloudinary(done);
      } else {
        this.uploadFilesToCloudinary(done);
      }
    });
  };

  private uploadFilesToCloudinary = (done: (err?: Error) => void) => {
    this.fileNames.forEach((fileName) => {
      Logger.debug('Storage process -> ' + FStorageEvents.CLOUDINARY_ASK_STREAM);
      EventBus.emit(FStorageEvents.CLOUDINARY_ASK_STREAM, { fileName, done });
    });
  };

  private uploadFileURLToCloudinary = (done: (err?: Error) => void) => {
    Logger.debug('Storage process -> ' + FStorageEvents.CLOUDINARY_ASK_URL);
    EventBus.emit(FStorageEvents.CLOUDINARY_ASK_URL, { fileUrl: this.url, done });
  };

  performQueue = () => {
    agenda.now(this.job);
  };
}
