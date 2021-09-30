import session from 'express-session';
import config from 'server/config';
import ConnectMongo from 'connect-mongo';
import { SchemaNames } from 'server/models/types';

export const initExpressSession = () => {
  return session({
    secret: config.COOKIE_SECRET ?? '',
    resave: false,
    saveUninitialized: false,
    store: ConnectMongo.create({
      collectionName: SchemaNames.APP_SESSIONS,
      mongoUrl: config.MONGO
    })
  });
};

export enum SessionCookie {
  SesId = 'blogMe.uid'
}
