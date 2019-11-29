import mongoose from 'mongoose';
import { SchemaNames, User } from './types';
const timestamps = require('mongoose-timestamp');

export const UsersSchema = new mongoose.Schema(
	{
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    roles: [],
    password: String,
    refreshToken: String,
    resetId: String,
    notifications: {
      email: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LANGUAGE,
      required: true
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.COMMENT
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LIKES
    }]
  },
	{ collection: SchemaNames.USERS }
);

UsersSchema.plugin(timestamps);
UsersSchema.index({ email: 1 });

export default mongoose.model<User>(SchemaNames.USERS, UsersSchema);
