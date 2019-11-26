import BlogModel from 'server/models/blogs';

export const getBlogCaptionData = async (blogId: string) => {
  const { title, coverPhotoUrl } = await BlogModel.findById(blogId)
    .select('title, coverPhotoUrl')
    .lean();

  return {
    title,
    coverPhotoUrl
  };
};
