import QuizModel from 'server/models/quizzes';
import QuizParticipantModel from 'server/models/quizParticipants';
import { Request, Response } from 'express-serve-static-core';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { QuizzStatus, ParticipationHistory } from 'server/models/types';

export const startQuiz = async (req: Request, res: Response) => {
  try {
    const data = {
      quizId: req.body.quizId,
      userId: req.session.userId,
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        quizId: validator.typeOfNumber,
        userId: validator.notMongooseObject,
      },
      data
    );

    await formator.formatData(
      {
        quizId: formator.formatNumber,
        userId: formator.formatString,
      },
      data
    );

    const quiz = await QuizModel.findOne({ shortId: data.quizId, deleted: null })
      .where('status')
      .ne(QuizzStatus.Draft)
      .exec();

    if (!quiz || !!quiz.quizParticipants.includes(data.userId)) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    const newParticipant = await new QuizParticipantModel({
      lastStep: 1,
      user: data.userId,
      quiz: quiz.id,
    }).save();

    await quiz
      .set({
        quizParticipants: [...quiz.quizParticipants, newParticipant.id],
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
export const setParticipantActions = async (req: Request, res: Response) => {
  try {
    const data = {
      quizId: req.body.quizId,
      userId: req.session.userId,
      actions: req.body.actions as Partial<ParticipationHistory>,
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        quizId: validator.typeOfNumber,
        userId: validator.notMongooseObject,
        actions: validator.notIsEmpty,
      },
      data
    );

    await formator.formatData(
      {
        quizId: formator.formatNumber,
        userId: formator.formatString,
      },
      data
    );

    const quizParticipant = await QuizParticipantModel.findOne({
      finished: false,
      user: data.userId,
    })
      .populate({
        path: 'quiz',
        match: { shortId: data.quizId, deleted: null, status: QuizzStatus.Open },
      })
      .exec();

    if (!quizParticipant || !quizParticipant.quiz) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    await quizParticipant
      .set({
        finished: data.actions.finished || quizParticipant.finished,
        lastStep: data.actions.lastStep || quizParticipant.lastStep,
        answers: {
          ...quizParticipant.answers,
          ...(data.actions.answers || {}),
        },
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
