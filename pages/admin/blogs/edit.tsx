import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { BlogData } from 'core/models/admin';
import { AdminLayout } from 'ui/cells/admin';
import { BlogForm } from 'ui/cells/admin/blogs';
import { getBlogData } from 'ui/cells/admin/blogs/operations';

type localState = {
  blogData: BlogData;
};

class EditBlog extends React.PureComponent<WithRouterProps, localState> {
  state: localState = {
    blogData: undefined
  };
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
      const blogData = await getBlogData(Number(this.props.router.query.blogId));
      this.setState({ blogData });
    } catch (e) {
      console.error('Error in Admin EditBlog fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <BlogForm
          blogId={Number(this.props.router.query.blogId)}
          initialValues={this.state.blogData}
        />
      </AdminLayout>
    );
  }
}

export default withRouter(EditBlog);
