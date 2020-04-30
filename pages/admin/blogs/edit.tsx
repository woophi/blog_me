import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { BlogData, FacebookPageItem } from 'core/models/admin';
import { AdminLayout } from 'ui/cells/admin/layouts';
import { getBlogData } from 'ui/cells/admin/blogs/operations';
import { getFacebookPages } from 'ui/cells/facebook/operations';
import dynamic from 'next/dynamic';

type localState = {
  blogData: BlogData;
  fbData: FacebookPageItem[]
};

const DynamicComponentWithNoSSR = dynamic(() => import('ui/cells/admin/blogs/BlogForm'), {
  ssr: false
})

class EditBlog extends React.PureComponent<WithRouterProps, localState> {
  state: localState = {
    blogData: undefined,
    fbData: []
  };
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
      const blogData = await getBlogData(Number(this.props.router.query.blogId));
      const fbData = await getFacebookPages();
      this.setState({ blogData, fbData });
    } catch (e) {
      console.error('Error in Admin EditBlog fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <DynamicComponentWithNoSSR
          blogId={Number(this.props.router.query.blogId)}
          initialValues={this.state.blogData}
          facebookPages={this.state.fbData}
        />
      </AdminLayout>
    );
  }
}

export default withRouter(EditBlog);
