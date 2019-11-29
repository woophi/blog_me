import mongoose from 'mongoose';
import { SchemaNames, Comment } from './types';
const timestamps = require('mongoose-timestamp');

export const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    deleted: {
      type: Date
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.COMMENT
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS,
      required: true
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.BLOGS,
      required: true
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.COMMENT
      }
    ]
  },
  { collection: SchemaNames.COMMENT }
);

CommentSchema.plugin(timestamps);

export default mongoose.model<Comment>(SchemaNames.COMMENT, CommentSchema);
