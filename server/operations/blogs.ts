import BlogModel from 'server/models/blogs';

export const getBlogCaptionData = async (blogId: string) => {
  const { title, coverPhotoUrl, shortText } = await BlogModel.findById(blogId)
    .select('title coverPhotoUrl shortText')
    .lean();

  return {
    title,
    coverPhotoUrl,
    shortText
  };
};
