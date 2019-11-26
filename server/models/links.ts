import mongoose from 'mongoose';
import { SchemaNames, Links } from './types';
const timestamps = require('mongoose-timestamp');

export const LinksSchema = new mongoose.Schema(
	{
    uniqId: String,
    email: String,
    valid: Date
  },
	{ collection: SchemaNames.LINKS }
);

LinksSchema.plugin(timestamps);

export default mongoose.model<Links>(SchemaNames.LINKS, LinksSchema);
