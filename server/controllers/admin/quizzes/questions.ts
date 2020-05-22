import QuizQuestionModel from 'server/models/quizQuestions';
import * as models from 'server/models/types';
import { Request, Response } from 'express-serve-static-core';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import async from 'async';
import * as formator from 'server/formator';

export const createQuestions = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      questions: req.body.questions as Pick<
        models.QuizQuestionModel,
        'question' | 'step'
      >[],
    };

    await validator.check(
      {
        questions: validator.required,
      },
      data
    );

    async.forEach(data.questions, (questionObj) => {
      new QuizQuestionModel({
        question: questionObj.question,
        step: questionObj.step,
      }).save();
    });

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

type UpdateType = {
  id: string;
} & Pick<models.QuizQuestionModel, 'question' | 'step'>;

export const updateQuestions = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      questions: req.body.questions as UpdateType[],
    };

    await validator.check(
      {
        questions: validator.required,
      },
      data
    );

    async.forEach(data.questions, (questionObj) => {
      QuizQuestionModel.findByIdAndUpdate(questionObj.id, {
        step: questionObj.step,
        question: questionObj.question,
      });
    });

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = QuizQuestionModel.find()
      .populate({
        path: 'quiz',
        select: 'shortId -_id',
      })
      .select('quiz step question')
      .lean();

    return res.send(questions).status(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const data = {
      questionId: req.query['id']
    }
    const validator = new Validator(req, res);
    await validator.check(
      {
        questionId: validator.notMongooseObject
      },
      data
    );
    await formator.formatData(
      {
        questionId: formator.formatString
      },
      data
    );
    const questionData = QuizQuestionModel
      .findById(data.questionId)
      .populate({
        path: 'quiz',
        select: 'shortId -_id',
      })
      .select('quiz step question')
      .lean();

    return res.send(questionData).status(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
