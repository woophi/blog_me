import { Box } from '@material-ui/core';
import { UserDetail } from 'core/models/admin';
import { getSelectedVkUser } from 'core/selectors/testfrindship';
import { FC } from 'react';
import { useSelector } from 'react-redux';

export const SelectedUserDetail: FC<{ data?: UserDetail }> = ({ data = {} }) => {
  const {} = data;
  const userInfo = useSelector(getSelectedVkUser);
  console.log('userInfo', userInfo);
  console.log('data', data);
  return <Box>omg</Box>;
};
