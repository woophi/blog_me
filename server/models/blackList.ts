import mongoose from 'mongoose';
import { SchemaNames, Ban } from './types';
const timestamps = require('mongoose-timestamp');

export const BlackListSchema = new mongoose.Schema(
	{
		reason: {
			type: String,
			required: true
		},
		ip: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    level: {
      type: String,
      enum : ['comment','view', 'all'],
      required: true
    }
  },
	{ collection: SchemaNames.BLACK_LIST }
);

BlackListSchema.plugin(timestamps);

export default mongoose.model<Ban>(SchemaNames.BLACK_LIST, BlackListSchema);
