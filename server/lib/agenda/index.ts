import Agenda from 'agenda';
import { SchemaNames } from 'server/models/types';
import mongoose from 'mongoose';
import { databaseUri, generalMgOptions } from '../db';
import { Logger } from 'server/logger';
import LinksModel from 'server/models/links';
import { AgendaJobName } from './constants';

export const agenda: Agenda = new Agenda(
  {
    mongo: mongoose.createConnection(databaseUri, generalMgOptions).db,
    db: {
      address: databaseUri,
      collection: SchemaNames.JOBS,
      options: {
        useNewUrlParser: true,
      },
    },
  },
  () => agenda.start().then(() => redefineAllJobs())
);

export const registerAgendaEvents = () => {
  Logger.debug('Register Agenda Events');
};

agenda.on('ready', function () {
  registerAgendaEvents();
  agenda.every('1 minute', AgendaJobName.fetchHaudiPosts);
  agenda.every('1 minute', AgendaJobName.checkVkPostToNotify);
});

agenda.on('start', (job) => {
  Logger.debug('Job starting', job.attrs.name);
});

agenda.on('fail', (err, job) => {
  Logger.debug(`Job failed with error: ${err.message}`, job.attrs.name);
});

const redefineAllJobs = async () => {
  const jobs = await agenda.jobs({
    lastFinishedAt: undefined,
    name: { $in: [/new blog scheduler id/, /queueLinkScheduler id/] },
  });
  jobs.forEach((j) => {
    if (j.attrs.name.includes(AgendaJobName.queueLinkSchedulerIdToDelete)) {
      Logger.debug('redefined link', j.attrs.name);
      scheduleLinkToDeleteJob(j.attrs.name);
    }
  });
};

const scheduleLinkToDeleteJob = (taskName: string) => {
  agenda.define<{ uniqId: string }>(
    taskName,
    async (job, done: (err?: Error) => void) => {
      Logger.debug('Runnig delete link', job.attrs.data.uniqId);
      await LinksModel.deleteOne({ uniqId: job.attrs.data.uniqId });
      if (done) {
        done();
      }
    }
  );
};
