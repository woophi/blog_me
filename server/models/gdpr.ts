import mongoose from 'mongoose';
import { SchemaNames, GDPR } from './types';
const timestamps = require('mongoose-timestamp');

export const GDPRSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true
		},
		language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LANGUAGE,
      required: true
    }
  },
	{ collection: SchemaNames.GDPR }
);

GDPRSchema.plugin(timestamps);

export default mongoose.model<GDPR>(SchemaNames.GDPR, GDPRSchema);
