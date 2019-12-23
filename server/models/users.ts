import mongoose from 'mongoose';
import { SchemaNames, User } from './types';
const timestamps = require('mongoose-timestamp');

export const UsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      default: null
    },
    roles: [],
    password: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
    resetId: {
      type: String,
      default: null
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      }
    },
    gravatarPhotoUrl: {
      type: String,
      default: null
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LANGUAGE,
      required: true
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.COMMENT
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.LIKES
      }
    ],
    rates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.COMMENT
      }
    ]
  },
  { collection: SchemaNames.USERS }
);

UsersSchema.plugin(timestamps);

export default mongoose.model<User>(SchemaNames.USERS, UsersSchema);
