import mongoose from 'mongoose';
import { SchemaNames, ShortLink } from './types';
const timestamps = require('mongoose-timestamp');

export const ShortLinksSchema = new mongoose.Schema(
  {
    originalUrl: String,
    urlCode: String,
    shortUrl: String
  },
  { collection: SchemaNames.SHORT_LINKS }
);

ShortLinksSchema.plugin(timestamps);

export default mongoose.model<ShortLink>(SchemaNames.SHORT_LINKS, ShortLinksSchema);
