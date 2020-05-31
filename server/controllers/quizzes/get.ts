import QuizModel from 'server/models/quizzes';
import { Request, Response } from 'express-serve-static-core';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { QuizzStatus } from 'server/models/types';

export const getQuizForGuest = async (req: Request, res: Response) => {
  try {
    const data = {
      quizId: req.query.quizId,
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        quizId: validator.typeOfNumber,
      },
      data
    );

    await formator.formatData(
      {
        quizId: formator.formatNumber,
      },
      data
    );

    let q = QuizModel.findOne({ shortId: data.quizId, deleted: null })
      .where('status')
      .ne(QuizzStatus.Draft)
      .populate({
        path: 'quizQuestions',
        options: { sort: { step: 'asc' } },
      });

    const quiz = await q.exec();

    if (!quiz) return res.sendStatus(HTTPStatus.NotFound);

    return res.send({
      quizId: quiz.shortId,
      status: quiz.status,
      subtitle: quiz.subtitle,
      title: quiz.title,
      questions: quiz.quizQuestions.map((q) => ({
        id: q.id,
        step: q.step,
        question: q.question,
        type: q.type,
      })),
      participationHistory: null,
      plainTitle: quiz.plainTitle
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const getQuizParticipationInfo = async (req: Request, res: Response) => {
  try {
    const data = {
      quizId: req.query.quizId,
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
      .populate({
        path: 'quizParticipants',
        match: { user: data.userId },
      })
      .exec();

    if (!quiz || !quiz.quizParticipants[0]) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    return res.send({
      finished: quiz.quizParticipants[0].finished,
      lastStep: quiz.quizParticipants[0].lastStep,
      answers: quiz.quizParticipants[0].answers,
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
