import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin/layouts';
import { getFacebookPages } from 'ui/cells/facebook/operations';
import { FacebookPageItem } from 'core/models/admin';
import dynamic from 'next/dynamic';

type localState = {
  fbData: FacebookPageItem[];
};


const BlogForm = dynamic(import('ui/cells/admin/blogs/BlogForm'), {
  ssr: false
});

class NewBlog extends React.PureComponent<unknown, localState> {
  state: localState = {
    fbData: []
  };
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
      const fbData = await getFacebookPages();
      this.setState({ fbData });
    } catch (e) {
      console.error('Error in Admin NewBlog fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <BlogForm facebookPages={this.state.fbData} />
      </AdminLayout>
    );
  }
}

export default NewBlog;
