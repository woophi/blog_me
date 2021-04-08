import { Box, Button, Divider } from '@material-ui/core';
import { goToDeep } from 'core/common';
import { ensureNotAuthorized } from 'core/operations/auth';
import * as React from 'react';
import { AdminLayout } from 'ui/cells/admin';
import {
  BanList,
  DelationList,
  TopCoinsList,
  TopQuizziesList,
} from 'ui/cells/admin/friendship';

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
        <Box margin="1rem">
          <Button
            variant="contained"
            color="primary"
            onClick={() => goToDeep('season')}
          >
            Сезон
          </Button>
        </Box>
        <Divider />
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
