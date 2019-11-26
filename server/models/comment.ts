import mongoose from 'mongoose';
import { SchemaNames, Comment } from './types';
const timestamps = require('mongoose-timestamp');

export const CommentSchema = new mongoose.Schema(
	{
    text: {
      type: String
    },
		deleted: {
			type: Date
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS
    }
  },
	{ collection: SchemaNames.COMMENT }
);

CommentSchema.plugin(timestamps);

export default mongoose.model<Comment>(SchemaNames.COMMENT, CommentSchema, SchemaNames.COMMENT);
