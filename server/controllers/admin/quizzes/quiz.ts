import QuizModel from 'server/models/quizzes';
import * as models from 'server/models/types';
import { Request, Response } from 'express-serve-static-core';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { generateRandomNumbers } from 'server/utils/prgn';
import moment from 'moment';

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
      plainTitle: formator.formatHtml(data.title),
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
        plainTitle: formator.formatHtml(data.title),
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

    const quiz = await QuizModel.findOne({ shortId: data.quizId, deleted: null })
      .populate({
        path: 'quizQuestions',
        options: { sort: { step: 'asc' } },
      })
      .exec();

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
      id: quiz.id,
      plainTitle: quiz.plainTitle,
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  const quizzes = await QuizModel.find()
    .where('deleted', null)
    .sort('createdAt')
    .select('shortId status quizQuestions quizParticipants plainTitle -_id')
    .lean();

  return res.send(quizzes);
};

export const getQuizParticipants = async (req: Request, res: Response) => {
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

    const quiz = await QuizModel.findOne({ shortId: data.quizId, deleted: null })
      .populate({
        path: 'quizParticipants',
        populate: {
          path: 'user',
          select: 'name id',
        },
      })
      .populate({
        path: 'quizQuestions'
      })
      .exec();

    if (!quiz) return res.sendStatus(HTTPStatus.NotFound);

    return res.send(
      quiz.quizParticipants.map((qp) => ({
        finished: qp.finished,
        lastStep: qp.lastStep,
        answers: qp.answers,
        userName: qp.user.name,
        userId: qp.user.id,
        questions: quiz.quizQuestions.map(q => ({
          step: q.step,
          question: q.question
        }))
      }))
    );
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
