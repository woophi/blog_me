import Agenda from 'agenda';
import { SchemaNames } from 'server/models/types';
import mongoose from 'mongoose';
import { databaseUri, generalMgOptions } from '../db';

export const agenda: Agenda = new Agenda(
  {
    mongo: mongoose.createConnection(databaseUri, generalMgOptions).db,
    db: {
      address: databaseUri,
      collection: SchemaNames.JOBS,
      options: {
        useNewUrlParser: true
      }
    }
  },
  () => agenda.start()
);
