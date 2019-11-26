import uuidv4 from 'uuid/v4';
import LinksModel from 'server/models/links';
import * as models from 'server/models/types';
import moment from 'moment';
import { Logger } from 'server/logger';
import { UnsubState } from './types';
import { agenda } from 'server/lib/agenda';

const rofl = 'kek';
export const createUniqLink = async (email: string) => {
  try {
    const Link = (await LinksModel.findOne({ email }).exec()) as models.Links;

    if (Link) {
      if (!checkLinkTimeValidation(Link.valid)) {
        await Link.set({
          valid: moment()
            .add(5, 'days')
            .toDate()
        }).save();
        queueLinkScheduler(Link.uniqId, Link.valid);
      }
      return Link.uniqId;
    } else {
      const uniqId = uuidv4();
      const valid = moment()
        .add(5, 'days')
        .toDate();
      await new LinksModel({
        email,
        uniqId,
        valid
      } as models.LinksModel).save();
      queueLinkScheduler(uniqId, valid);
      return uniqId;
    }
  } catch (error) {
    Logger.error('Cannot save unsub link', error);
    return rofl;
  }
};

export const checkLinkTimeValidation = (time: Date) => {
  return moment(time).isAfter(Date.now());
};

export const checkLinkState = (link: models.Links) => {
  if (!link || !checkLinkTimeValidation(link.valid)) return UnsubState.INVALID;

  return UnsubState.VALID;
};

const queueLinkScheduler = async (uniqId: string, execDate: Date) => {
  const task = `queueLinkScheduler id ${uniqId}`;
  const jobs = await agenda.jobs({ name: task });
  if (jobs.length) {
    const j = jobs[0];
    j.schedule(execDate);
  } else {
    agenda.define(task, { priority: 'high', concurrency: 10 }, async (_, done: (err?: Error) => void) => {
      Logger.debug('Runnig link deletion task', uniqId);
      await LinksModel.deleteOne({ uniqId });
      if (done) {
        done();
      }
    });
    await agenda.schedule(execDate, task);
  }
};
