import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin';
import { BlogForm } from 'ui/cells/admin/blogs';
4
class NewBlog extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Admin NewBlog fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <BlogForm />
      </AdminLayout>
    );
  }
}

export default NewBlog;
