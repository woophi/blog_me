import mongoose from 'mongoose';
import { SchemaNames, QuizQuestion } from './types';
const timestamps = require('mongoose-timestamp');

export const QuizQuestionSchema = new mongoose.Schema(
	{
    question: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.QUIZZES
    }
  },
	{ collection: SchemaNames.QUIZ_QUESTIONS }
);

QuizQuestionSchema.plugin(timestamps);

export default mongoose.model<QuizQuestion>(SchemaNames.QUIZ_QUESTIONS, QuizQuestionSchema);
