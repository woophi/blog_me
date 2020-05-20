import mongoose from 'mongoose';
import { SchemaNames, QuizQuestion } from './types';
const timestamps = require('mongoose-timestamp');

export const QuizParticipantSchema = new mongoose.Schema(
	{
    finished: {
      type: Boolean,
      default: false
    },
    lastStep: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS,
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.QUIZZES,
      required: true
    },
    answers: {}
  },
	{ collection: SchemaNames.QUIZ_PARTICIPANTS }
);

QuizParticipantSchema.plugin(timestamps);

export default mongoose.model<QuizQuestion>(SchemaNames.QUIZ_PARTICIPANTS, QuizParticipantSchema);
