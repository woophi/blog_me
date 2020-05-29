import QuizQuestionModel from 'server/models/quizQuestions';
import * as models from 'server/models/types';
import { Request, Response } from 'express-serve-static-core';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import async from 'async';
import * as formator from 'server/formator';
import sortBy from 'ramda/src/sortBy';

type SaveType = {
  id?: string;
} & Pick<models.QuizQuestionModel, 'question' | 'step'>;

export const updateQuestions = async (req: Request, res: Response) => {
  try {
    const validator = new Validator(req, res);
    const data = {
      questions: req.body.questions as SaveType[],
    };

    await validator.check(
      {
        questions: validator.required,
      },
      data
    );

    const questionToCreate = data.questions.filter((q) => !q.id);
    const questionToUpdate = data.questions.filter((q) => !!q.id);

    const questionsResponse: SaveType[] = [];

    await async.forEach(questionToUpdate, async (questionObj) => {
      await QuizQuestionModel.findByIdAndUpdate(questionObj.id, {
        step: questionObj.step,
        question: questionObj.question,
      });
      questionsResponse.push(questionObj);
    });

    await async.forEach(questionToCreate, async (questionObj) => {
      const newQuestion = await new QuizQuestionModel({
        question: questionObj.question,
        step: questionObj.step,
      }).save();
      questionsResponse.push({
        ...questionObj,
        id: newQuestion.id,
      });
    });

    return res.send(sortBy((q) => q.step, questionsResponse));
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
      questionId: req.query['id'],
    };
    const validator = new Validator(req, res);
    await validator.check(
      {
        questionId: validator.notMongooseObject,
      },
      data
    );
    await formator.formatData(
      {
        questionId: formator.formatString,
      },
      data
    );
    const questionData = QuizQuestionModel.findById(data.questionId)
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
