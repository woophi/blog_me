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
