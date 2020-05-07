import mongoose from 'mongoose';
import { SchemaNames, Files } from './types';
const timestamps = require('mongoose-timestamp');

export const FilesSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		url: {
			type: String,
      required: true
    },
		thumbnail: {
      type: String,
      default: null
    },
    format: {
      type: String,
      default: null
    }
  },
	{ collection: SchemaNames.FILES }
);

FilesSchema.plugin(timestamps);

export default mongoose.model<Files>(SchemaNames.FILES, FilesSchema);
