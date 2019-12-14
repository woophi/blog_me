import mongoose from 'mongoose';
import { SchemaNames, Blog } from './types';
const timestamps = require('mongoose-timestamp');

export const BlogSchema = new mongoose.Schema(
  {
    blogId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    coverPhotoUrl: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    publishedDate: {
      type: Date,
      required: true
    },
    deleted: { 
      type: Date,
      default: null
    },
    draft: {
      type: Boolean,
      default: false
    },
    shortText: {
      type: String,
      required: true
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS,
      required: true
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LANGUAGE,
      required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LIKES
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.COMMENT
    }],
    // TODO: add after general
    // tags: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: SchemaNames.TAGS
    // }]
    // TODO: approx time when user scroll to the end of blog
    // TODO: shortlink relation
  },
  { collection: SchemaNames.BLOGS }
);

BlogSchema.plugin(timestamps);
BlogSchema.index({ blogId: 1 });

export default mongoose.model<Blog>(SchemaNames.BLOGS, BlogSchema);
