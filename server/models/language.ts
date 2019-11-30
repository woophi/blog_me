import mongoose from 'mongoose';
import { SchemaNames, Language } from './types';
const timestamps = require('mongoose-timestamp');

export const LanguageSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		localeId: {
			type: String,
      required: true,
      index: true,
      unique: true
    },
    deleted: {
      type: Date,
      default: null
    }
  },
	{ collection: SchemaNames.LANGUAGE }
);

LanguageSchema.plugin(timestamps);
LanguageSchema.index({ localeId: 1 });

export default mongoose.model<Language>(SchemaNames.LANGUAGE, LanguageSchema, SchemaNames.LANGUAGE);
