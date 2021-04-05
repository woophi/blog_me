import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin';
import { BanList } from 'ui/cells/admin/friendship/BanList';

class Admin extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Admin fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <BanList />
      </AdminLayout>
    );
  }
}

export default Admin;
