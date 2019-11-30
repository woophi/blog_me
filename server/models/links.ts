import mongoose from 'mongoose';
import { SchemaNames, Links } from './types';
const timestamps = require('mongoose-timestamp');

export const LinksSchema = new mongoose.Schema(
	{
    uniqId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    valid: {
      type: Date,
      required: true
    }
  },
	{ collection: SchemaNames.LINKS }
);

LinksSchema.plugin(timestamps);

export default mongoose.model<Links>(SchemaNames.LINKS, LinksSchema);
