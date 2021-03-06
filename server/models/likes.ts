import mongoose from 'mongoose';
import { SchemaNames, Likes } from './types';
const timestamps = require('mongoose-timestamp');

export const LikesSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS,
      default: null
    },
		blog: {
			type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.BLOGS,
      required: true
    }
  },
	{ collection: SchemaNames.LIKES }
);

LikesSchema.plugin(timestamps);

export default mongoose.model<Likes>(SchemaNames.LIKES, LikesSchema);
