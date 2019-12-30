import BlogModel from 'server/models/blogs';
import config from 'server/config';

export const getBlogCaptionData = async (blogId: number) => {
  const { title, coverPhotoUrl, shortText } = await BlogModel.findOne({
    blogId
  })
    .select('title coverPhotoUrl shortText')
    .lean();

  return {
    title,
    coverPhotoUrl,
    shortText
  };
};

export const getBlogObjectId = async (blogId: number): Promise<string> => {
  try {
    const { _id } = await BlogModel.findOne({ blogId })
      .select('id')
      .lean();
    return _id;
  } catch {
    return null;
  }
};

export const blogRelativeUrl = (blogId: number, title: string) => {
  const mapTitle = title
    .toLowerCase()
    .split(' ')
    .join('-');

  return `${config.SITE_URI}post/${mapTitle}-${blogId}`;
};


export const getBlogShortLink = async (blogId: number) => {
  const blog = await BlogModel.findOne({ blogId })
    .populate({
      path: 'shortLink',
      select: 'shortUrl -_id'
    })
    .select('shortLink')
    .lean();
  return blog?.shortLink?.shortUrl ?? '';
};