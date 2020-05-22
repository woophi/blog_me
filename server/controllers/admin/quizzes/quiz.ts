import QuizModel from 'server/models/quizzes';
import QuizQuestionModel from 'server/models/quizQuestions';
import QuizParticipantModel from 'server/models/quizParticipants';
import * as models from 'server/models/types';
import { Request, Response } from 'express-serve-static-core';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { generateRandomNumbers } from 'server/utils/prgn';
import moment from 'moment';
import async from 'async';

export const createNewQuiz = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      title: req.body.title,
      subtitle: req.body.subtitle,
    };
    await validator.check(
      {
        title: validator.required,
        subtitle: validator.required,
      },
      data
    );
    await formator.formatData(
      {
        title: formator.formatString,
        subtitle: formator.formatString,
      },
      data
    );

    const shortId = await ensureUniqQuizId();

    const newQuizz = await new QuizModel({
      title: data.title,
      subtitle: data.subtitle,
      shortId,
    } as Partial<models.QuizModel>).save();

    return res.send({ quizId: newQuizz.shortId }).status(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

const ensureUniqQuizId = async (): Promise<number> => {
  const quizd = generateRandomNumbers(1, 9999999);
  const exists = (await QuizModel.findOne({ shortId: quizd }).countDocuments()) > 0;
  if (exists) {
    return await ensureUniqQuizId();
  }
  return quizd;
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      shortId: req.body.quizId,
      title: req.body.title,
      subtitle: req.body.subtitle,
      questions: req.body.questions,
      status: req.body.status,
    };
    await validator.check(
      {
        title: validator.required,
        subtitle: validator.required,
        shortId: validator.required,
        status: validator.required,
      },
      data
    );
    await formator.formatData(
      {
        title: formator.formatString,
        subtitle: formator.formatString,
        shortId: formator.formatNumber,
        status: formator.formatString,
      },
      data
    );

    const quizz = await QuizModel.findOne({
      shortId: data.shortId,
      deleted: null,
    }).exec();

    if (!quizz) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    await quizz
      .set({
        title: data.title,
        subtitle: data.subtitle,
        quizQuestions: data.questions,
        status: data.status,
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      shortId: req.body.quizId,
    };
    await validator.check(
      {
        shortId: validator.required,
      },
      data
    );
    await formator.formatData(
      {
        shortId: formator.formatNumber,
      },
      data
    );

    const quizz = await QuizModel.findOne({
      shortId: data.shortId,
      deleted: null,
    }).exec();

    if (!quizz) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    await quizz
      .set({
        deleted: moment().toDate(),
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  const quizId = req.query['quizId'];
  if (!quizId) return res.sendStatus(HTTPStatus.BadRequest);

  const quiz = await QuizModel.findOne({ shortId: quizId, deleted: null }).exec();

  if (!quiz) return res.sendStatus(HTTPStatus.NotFound);

  return res.send({
    quizId: quiz.shortId,
    status: quiz.status,
    subtitle: quiz.subtitle,
    title: quiz.title,
    questions: quiz.quizQuestions,
  });
};

export const getQuizzes = async (req: Request, res: Response) => {
  const data = {
    offset: req.body.offset,
    limit: 50,
  };

  await formator.formatData(
    {
      offset: formator.formatNumber,
      limit: formator.formatNumber,
    },
    data
  );

  const quizzes = await QuizModel.find()
    .where('deleted', null)
    .sort('createdAt')
    .select('shortId status subtitle title quizQuestions quizParticipants -_id')
    .skip(data.offset)
    .limit(data.limit)
    .lean();

  return res.send(quizzes);
};

export const updateQuizWithQuestions = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      shortId: req.body.quizId,
      questionIds: req.body.questionIds as string[],
    };
    await validator.check(
      {
        shortId: validator.required,
        quesstionIds: validator.required,
      },
      data
    );
    await formator.formatData(
      {
        shortId: formator.formatNumber,
      },
      data
    );

    const quizz = await QuizModel.findOne({
      shortId: data.shortId,
      deleted: null,
    }).exec();

    if (!quizz) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    await quizz
      .set({
        quizQuestions: data.questionIds,
      })
      .save();

    async.forEach(data.questionIds, (questionId) => {
      QuizQuestionModel.findByIdAndUpdate(questionId, {
        quiz: quizz.id,
      });
    });

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
