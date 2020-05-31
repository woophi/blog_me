import mongoose from 'mongoose';
import { SchemaNames, Quiz, QuizzStatus } from './types';
const timestamps = require('mongoose-timestamp');

export const QuizzesSchema = new mongoose.Schema(
	{
    shortId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    plainTitle: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'closed'],
      default: QuizzStatus.Draft
    },
    deleted: {
      type: Date,
      default: null
    },
    quizQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.QUIZ_QUESTIONS,
      }
    ],
    quizParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.QUIZ_PARTICIPANTS,
      }
    ]
  },
	{ collection: SchemaNames.QUIZZES }
);

QuizzesSchema.plugin(timestamps);

export default mongoose.model<Quiz>(SchemaNames.QUIZZES, QuizzesSchema);
