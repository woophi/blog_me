import * as React from 'react';
import { GeneralLayout } from 'ui/index';
import { getBLog } from 'core/operations';
import { BlogGuest } from 'core/models';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import isEmpty from 'ramda/src/isEmpty';
import or from 'ramda/src/or';
import isNil from 'ramda/src/isNil';
import { NextPageContext } from 'next';
import { BlogLayout } from 'ui/cells';
import { connectSocketBlog, joinRoom, leaveRoom } from 'core/socket/blog';
import Head from 'next/head';
import getConfig from 'next/config';
import Error from './_error';
const { publicRuntimeConfig } = getConfig();
const { SITE_URL } = publicRuntimeConfig;

type Props = {
  blog: BlogGuest;
} & WithRouterProps;
class Blog extends React.Component<Props> {
  static async getInitialProps(context: NextPageContext) {
    try {
      const blog = await getBLog(Number(context.query.blogId));
      return { blog };
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  static defaultProps: Partial<Props> = {
    blog: null
  };

  state = {
    blog: {} as BlogGuest
  };

  async componentDidMount() {
    connectSocketBlog();
    joinRoom(String(this.props.router.query.blogId));
    if (or(isEmpty(this.props.blog), isNil(this.props.blog))) {
      const blog = await getBLog(Number(this.props.router.query.blogId));
      this.setState({ blog });
    }
  }

  componentWillUnmount() {
    leaveRoom(String(this.props.router.query.blogId));
  }

  render() {
    const blog = or(isEmpty(this.props.blog), isNil(this.props.blog))
      ? this.state.blog
      : this.props.blog;

    if (or(isEmpty(blog), isNil(blog))) {
      return <Error statusCode={404} err={''} />
    }

    const { title, shortText, coverPhotoUrl, blogId } = blog;
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
  }
}

export default withRouter(Blog);
