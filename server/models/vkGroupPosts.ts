import mongoose from 'mongoose';
import { SchemaNames, VkGroupPost } from './types';
const timestamps = require('mongoose-timestamp');

export const VkGroupPostsSchema = new mongoose.Schema(
	{
		postId: {
			type: Number,
      required: true,
      index: true
		},
		postUrl: {
      type: String,
      required: true
    },
		text: {
      type: String
    },
		notified: {
      type: Boolean,
      default: false
    },
		needToBeNotified: {
      type: Boolean,
      default: false
    }
  },
	{ collection: SchemaNames.VK_GROUP_POSTS }
);

VkGroupPostsSchema.plugin(timestamps);

export default mongoose.model<VkGroupPost>(SchemaNames.VK_GROUP_POSTS, VkGroupPostsSchema);
