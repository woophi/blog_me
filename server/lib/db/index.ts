import mongoose from 'mongoose';
import config from 'server/config';
import { Logger } from 'server/logger';
mongoose.set('useCreateIndex', true);
export const databaseUri = config.PORT_MONGO;
export const generalMgOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 100,
}
Logger.info('connecting to mongo db')
export const connection = mongoose.connect(databaseUri, generalMgOptions);
Logger.info('connecting to mongo db started');

connection
  .then(db => {
    Logger.info(
      `Successfully connected to ${databaseUri} MongoDB cluster in ${
        config.DEV_MODE ? 'dev' : 'prod'
      } mode.`
    );
    return db;
  })
  .catch(err => {
    if (err.message.code === 'ETIMEDOUT') {
      Logger.info('Attempting to re-establish database connection.');
      mongoose.connect(databaseUri);
    } else {
      Logger.error('Error while attempting to connect to database:');
      Logger.error(err);
    }
  });

