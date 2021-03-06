import mongoose from 'mongoose';
import { SchemaNames, Blog } from './types';
const timestamps = require('mongoose-timestamp');

export const BlogSchema = new mongoose.Schema(
  {
    blogId: {
      type: Number,
      required: true,
      index: true
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
    updatedDate: {
      type: Date,
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
    views: {
      type: Number,
      default: 1
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS,
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.USERS
    },
    localeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LANGUAGE,
      required: true
    },
    shortLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.SHORT_LINKS
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.LIKES
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.COMMENT
      }
    ]
    // TODO: mbe future
    // tags: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: SchemaNames.TAGS
    // }]
  },
  { collection: SchemaNames.BLOGS }
);

BlogSchema.index(
  { title: 'text', body: 'text', shortText: 'text' },
  {
    weights: {
      title: 1,
      shortText: 2,
      body: 3
    }
  }
);
BlogSchema.plugin(timestamps);

BlogSchema.on('index', function(error) {
  console.log(error.message);
});

export default mongoose.model<Blog>(SchemaNames.BLOGS, BlogSchema);
