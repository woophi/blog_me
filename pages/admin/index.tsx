import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin';
import { BanList, DelationList } from 'ui/cells/admin/friendship';
import { Box, Divider, Typography } from '@material-ui/core';

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
        <Box width="100%" height="300px">
          <Box marginLeft="1rem">
            <Typography variant="subtitle1" gutterBottom>
              Забанены
            </Typography>
          </Box>
          <BanList />
        </Box>
        <Divider />
        <Box width="100%" height="350px">
          <Box marginLeft="1rem">
            <Typography variant="subtitle1" gutterBottom>
              Доносы
            </Typography>
          </Box>
          <DelationList />
        </Box>
        <Divider />
      </AdminLayout>
    );
  }
}

export default Admin;
