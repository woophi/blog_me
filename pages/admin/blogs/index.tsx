import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin';
import { AdminBlogs } from 'ui/cells/admin/blogs';

class Blogs extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Admin Blogs fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <AdminBlogs />
      </AdminLayout>
    );
  }
}

export default Blogs;
