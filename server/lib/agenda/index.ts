import Agenda from 'agenda';
import { SchemaNames } from 'server/models/types';
import mongoose from 'mongoose';
import { databaseUri, generalMgOptions } from '../db';
import { Logger } from 'server/logger';
import { EventBus, BusEvents, NewBlogEventParams } from '../events';
import BlogModel from 'server/models/blogs';
import LinksModel from 'server/models/links';
import { postToInstagram } from 'server/instagram';
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
  EventBus.on(BusEvents.NEW_BLOG, schedulePost);
};

const schedulePost = async ({ blogId }: NewBlogEventParams) => {
  const blog = await BlogModel.findOne({ blogId }).lean();
  if (!blog) return;
  const task = AgendaJobName.newBlogSchedulerToPublish + blogId;
  const jobs = await agenda.jobs({ name: task });
  if (jobs.length) {
    const j = jobs[0];
    j.schedule(blog.publishedDate);
    await j.save();
  } else {
    scheduleBlogPostJob(task);
    await agenda.schedule(blog.publishedDate, task, { blogId });
  }
};

agenda.on('ready', function () {
  registerAgendaEvents();
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
    if (j.attrs.name.includes(AgendaJobName.newBlogSchedulerToPublish)) {
      Logger.debug('redefined blog', j.attrs.name);
      scheduleBlogPostJob(j.attrs.name);
    } else if (j.attrs.name.includes(AgendaJobName.queueLinkSchedulerIdToDelete)) {
      Logger.debug('redefined link', j.attrs.name);
      scheduleLinkToDeleteJob(j.attrs.name);
    }
  });
};

const scheduleBlogPostJob = (taskName: string) => {
  agenda.define<{ blogId: number }>(
    taskName,
    { priority: 'high', concurrency: 10 },
    async (job, done: (err?: Error) => void) => {
      Logger.debug('Runnig post to social media task', job.attrs.data.blogId);
      await postToInstagram({ blogId: job.attrs.data.blogId, done });
    }
  );
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
