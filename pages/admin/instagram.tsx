import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin';
import { AdminInstagram } from 'ui/cells/instagram';

class Instagram extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Instagram fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <AdminInstagram />
      </AdminLayout>
    );
  }
}

export default Instagram;
