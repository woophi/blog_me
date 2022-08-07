import { BlogGuest } from 'core/models';
import { getBLog } from 'core/operations';
import { connectSocketBlog, joinRoom, leaveRoom } from 'core/socket/blog';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { BlogLayout } from 'ui/cells/blog-layout';
import { GeneralLayout } from 'ui/cells/general-layout';
const { publicRuntimeConfig } = getConfig();
const { SITE_URL } = publicRuntimeConfig;


const BlogPage = ({ blog }: { blog: BlogGuest }) => {
  const { title, shortText, coverPhotoUrl, blogId } = blog;
  const { query } = useRouter();

  React.useEffect(() => {
    connectSocketBlog();
    joinRoom(String(query.blogId));
    return () => {
      leaveRoom(String(query.blogId));
    };
  }, [query.blogId]);

  return (
    <>
      <Head>
        <meta
          property="og:url"
          content={`${SITE_URL}post/${title
            .toLowerCase()
            .split(' ')
            .join('-')}-${blogId}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={shortText} />
        <meta property="og:image" content={coverPhotoUrl} />
      </Head>
      <GeneralLayout title={title}>
        <BlogLayout blog={blog} />
      </GeneralLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const blog = await getBLog(Number(query.blogId));
    return {
      props: { blog },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default BlogPage;
