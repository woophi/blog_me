import { Model } from './mongoModel';

export type VkGroupPostModel = {
  postId: number;
  text: string;
  postUrl: string;
  notified: boolean;
  needToBeNotified: boolean;
};

export type VkGroupPost = Model<VkGroupPostModel>;

