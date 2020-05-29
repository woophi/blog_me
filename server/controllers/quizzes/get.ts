import QuizModel from 'server/models/quizzes';
import QuizQuestionModel from 'server/models/quizQuestions';
import QuizParticipantModel from 'server/models/quizParticipants';
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
      userId: req.session.userId ?? null,
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

    if (data.userId) {
      q = q.populate({
        path: 'quizParticipants',
        match: { user: data.userId },
      });
    }

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
      })),
      participationHistory: quiz.quizParticipants[0]
        ? {
            finished: quiz.quizParticipants[0].finished,
            lastStep: quiz.quizParticipants[0].lastStep,
            answers: quiz.quizParticipants[0].answers,
          }
        : null,
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
