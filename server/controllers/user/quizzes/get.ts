import QuizModel from 'server/models/quizzes';
import { Request, Response } from 'express-serve-static-core';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';

export const getUserQuizzes = async (req: Request, res: Response) => {
  try {
    const data = {
      userId: req.session?.userId,
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        userId: validator.notMongooseObject,
      },
      data
    );

    await formator.formatData(
      {
        userId: formator.formatString,
      },
      data
    );

    const quizzes = await QuizModel.find({ deleted: null })
      .populate({
        path: 'quizParticipants',
        match: { user: data.userId },
      })
      .populate({
        path: 'quizQuestions',
      })
      .exec();

    return res.send(
      quizzes.map((quiz) => ({
        quizName: quiz.plainTitle,
        quizId: quiz.shortId,
        finished: quiz.quizParticipants[0]?.finished,
        lastStep: quiz.quizParticipants[0]?.lastStep,
        answers: quiz.quizParticipants[0]?.answers,
        questions: quiz.quizQuestions.map((q) => ({
          step: q.step,
          question: q.question,
        })),
      }))
    );
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
