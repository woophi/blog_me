import mongoose from 'mongoose';
import { SchemaNames, Comment } from './types';
const timestamps = require('mongoose-timestamp');

export const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      default: 0
    },
    deleted: {
      type: Date,
      default: null
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.COMMENT,
      default: null
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
