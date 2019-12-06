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

type Props = {
  blog: BlogGuest;
} & WithRouterProps;
class Blog extends React.Component<Props> {
  static async getInitialProps(context: NextPageContext) {
    console.log(context.query);
    const blog = await getBLog(Number(context.query.blogId));
    return { blog };
  }

  static defaultProps: Partial<Props> = {
    blog: null
  };

  state = {
    blog: {} as BlogGuest
  };

  async componentDidMount() {
    if (or(isEmpty(this.props.blog), isNil(this.props.blog))) {
      const blog = await getBLog(Number(this.props.router.query.blogId));
      this.setState({ blog });
    }
  }

  render() {
    const blog = or(isEmpty(this.props.blog), isNil(this.props.blog))
      ? this.state.blog
      : this.props.blog;
    const { title } = blog;
    return (
      <GeneralLayout title={title}>
        <BlogLayout blog={blog} />
      </GeneralLayout>
    );
  }
}

export default withRouter(Blog);
