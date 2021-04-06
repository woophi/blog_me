import { Divider } from '@material-ui/core';
import { ensureNotAuthorized } from 'core/operations/auth';
import * as React from 'react';
import { AdminLayout } from 'ui/cells/admin';
import { BanList, DelationList, TopCoinsList, TopQuizziesList } from 'ui/cells/admin/friendship';

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
        <Divider />
        <DelationList />
        <Divider />
        <TopCoinsList />
        <Divider />
        <TopQuizziesList />
        <Divider />
      </AdminLayout>
    );
  }
}

export default Admin;
