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
  () => agenda.start()
);

export const registerAgendaEvents = () => {
  Logger.debug('Register Agenda Events');
  EventBus.on(BusEvents.NEW_BLOG, schedulePost);
};

const schedulePost = async ({ blogId }: NewBlogEventParams) => {
  const blog = await BlogModel.findOne({ blogId }).lean();
  if (!blog) return;
  const task = `new blog scheduler id ${blogId}`;
  const jobs = await agenda.jobs({ name: task });
  if (jobs.length) {
    const j = jobs[0];
    j.schedule(blog.publishedDate);
  } else {
    agenda.define(
      task,
      { priority: 'high', concurrency: 10 },
      async (_, done: (err?: Error) => void) => {
        Logger.debug('Runnig post to social media task', blogId);
        await postToInstagram({ blogId, done });
      }
    );
    await agenda.schedule(blog.publishedDate, task);
  }
};
