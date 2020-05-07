import * as cloudinary from 'cloudinary';
import config from '../config';
import { EventBus } from '../lib/events';
import * as fs from 'fs';
import { Logger } from '../logger';
import {
  FStorageEvents,
  FileEventParams,
  FileUrlEventParams,
} from './types';
import * as async from 'async';
import FilesModel from '../models/files';
import * as models from '../models/types';
import { getFilePath } from './helpers';
import { generateRandomString } from 'server/utils/prgn';

cloudinary.v2.config({
  cloud_name: config.FS_CLOUD_NAME,
  api_key: config.FS_API_KEY,
  api_secret: config.FS_API_SECRET,
});

const uploadUrl = async (url: string, done: FileUrlEventParams['done']) => {
  try {
    Logger.debug('** Url Upload');
    const image = await cloudinary.v2.uploader.upload(url);

    let thumbnail = '';

    if (image.height > 400) {
      const indexOfUpload = image.secure_url.indexOf('upload/') + 7;
      thumbnail =
        image.secure_url.substr(0, indexOfUpload) +
        'h_400/' +
        image.secure_url.substr(indexOfUpload);
    }

    const newFile: models.FilesModel = {
      name: image.original_filename ?? generateRandomString(8),
      url: image.secure_url,
      thumbnail: thumbnail ? thumbnail : image.secure_url,
      format: image.format
    };
    const createFile = await new FilesModel(newFile).save();
    Logger.debug('new file saved');
    EventBus.emit(FStorageEvents.UPLOADED_FILE_SUCCESS, {
      fileId: createFile._id,
      fileName: createFile.name,
      url: createFile.url,
      format: createFile.format
    });
  } catch (error) {
    Logger.error('err to save new file ', error);
    EventBus.emit(FStorageEvents.UPLOADED_FILE_ERROR, { fileName: url });
  } finally {
    if (done) {
      done();
    }
  }
};

export const upload_stream = (fileName: string, done: FileEventParams['done']) =>
  cloudinary.v2.uploader.upload_stream({}, (err, image) => {
    Logger.debug('** Stream Upload');
    if (err) {
      Logger.error(err);
      return done();
    }
    Logger.debug('* Same image, uploaded via stream');
    async.series(
      [
        (cb) => {
          let thumbnail = '';
          if (image.height > 400) {
            const indexOfUpload = image.secure_url.indexOf('upload/') + 7;
            thumbnail =
              image.secure_url.substr(0, indexOfUpload) +
              'h_400/' +
              image.secure_url.substr(indexOfUpload);
          }

          const newFile: models.FilesModel = {
            name: fileName,
            url: image.secure_url,
            thumbnail: thumbnail ? thumbnail : image.secure_url,
            format: image.format
          };

          const createFile = new FilesModel(newFile);
          createFile.save((err, file) => {
            if (err) {
              Logger.error('err to save new file ' + err);
              EventBus.emit(FStorageEvents.UPLOADED_FILE_ERROR, { fileName });
              return cb();
            }
            Logger.debug('new file saved');
            EventBus.emit(FStorageEvents.UPLOADED_FILE_SUCCESS, {
              fileId: file._id,
              fileName,
              url: newFile.url,
              format: newFile.format
            });
            return cb();
          });
        },
      ],
      () => {
        EventBus.emit(FStorageEvents.DELETE_TEMP_FILE, { fileName, done });
      }
    );
  });

export const registerCloudinaryEvents = () => {
  Logger.debug('Register Cloudinary Events');

  EventBus.on(
    FStorageEvents.CLOUDINARY_ASK_STREAM,
    ({ fileName, done }: FileEventParams) => {
      fs.createReadStream(getFilePath(fileName)).pipe(upload_stream(fileName, done));
    }
  );
  EventBus.on(
    FStorageEvents.CLOUDINARY_ASK_URL,
    ({ fileUrl, done }: FileUrlEventParams) => {
      uploadUrl(fileUrl, done);
    }
  );

  EventBus.on(
    FStorageEvents.DELETE_TEMP_FILE,
    ({ fileName, done }: FileEventParams) => {
      const path = getFilePath(fileName);
      if (!fs.existsSync(path)) {
        Logger.error('File not found ' + fileName);
        return done();
      }
      fs.unlink(path, (err) => {
        Logger.debug('delete file ' + fileName);
        if (err) {
          Logger.error('delete file err ' + err);
        }
        done(err);
      });
    }
  );
};
