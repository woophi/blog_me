import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin';
import { AdminFacebook } from 'ui/cells/facebook';

class Facebook extends React.PureComponent {

  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Facebook fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <AdminFacebook />
      </AdminLayout>
    );
  }
}

export default Facebook;
