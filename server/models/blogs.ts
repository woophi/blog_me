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
    localeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaNames.LANGUAGE,
      required: true
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
    // TODO: add after general
    // tags: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: SchemaNames.TAGS
    // }]
    // TODO: shortlink relation
    // TODO: views
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
