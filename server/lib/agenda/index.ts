import Agenda from 'agenda';
import { SchemaNames } from 'server/models/types';
import mongoose from 'mongoose';
import { databaseUri, generalMgOptions } from '../db';
import { Logger } from 'server/logger';
import { EventBus, BusEvents, NewBlogEventParams } from '../events';
import BlogModel from 'server/models/blogs';
import { postToInstagram } from 'server/instagram';

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
  () => agenda.start().then(() => redefineAllJobs())
);

export const registerAgendaEvents = () => {
  Logger.debug('Register Agenda Events');
  EventBus.on(BusEvents.NEW_BLOG, schedulePost);
};

const schedulePost = async ({ blogId, fbPageId }: NewBlogEventParams) => {
  const blog = await BlogModel.findOne({ blogId }).lean();
  if (!blog) return;
  const task = `new blog scheduler id ${blogId}`;
  const jobs = await agenda.jobs({ name: task });
  if (jobs.length) {
    const j = jobs[0];
    j.schedule(blog.publishedDate);
    await j.save();
  } else {
    schedulePostJob(task);
    await agenda.schedule(blog.publishedDate, task, { blogId });
  }
};

agenda.on('start', job => {
  Logger.debug('Job starting', job.attrs.name);
});

agenda.on('fail', (err, job) => {
  Logger.debug(`Job failed with error: ${err.message}`, job.attrs.name);
});

const redefineAllJobs = async () => {
  const jobs = await agenda.jobs({ lastFinishedAt: undefined });
  jobs.forEach(j => {
    Logger.debug('redefined job', j.attrs.name);
    schedulePostJob(j.attrs.name);
  });
};

const schedulePostJob = (taskName: string) => {
  agenda.define<{ blogId: number }>(
    taskName,
    { priority: 'high', concurrency: 10 },
    async (job, done: (err?: Error) => void) => {
      Logger.debug('Runnig post to social media task', job.attrs.data.blogId);
      await postToInstagram({ blogId: job.attrs.data.blogId, done });
    }
  );
};
