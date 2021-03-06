import * as React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Profile } from './Profile';
import { UserComments } from './UserComments';
import { UserLikes } from './UserLikes';
import { UserQuizzes } from './UserQuizzes';
import { TabPanel } from 'ui/atoms/TabPanel';

export const MeMainLayout = React.memo(() => {
  const [tabValue, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box padding="1rem">
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="on"
          >
            <Tab label="Профиль" />
            <Tab label="Комментарии" />
            <Tab label="Likes" />
            <Tab label="Пройденные опросы" />
          </Tabs>
        </Paper>
        <Box paddingTop="1rem" paddingX=".25rem">
          <TabPanel value={tabValue} index={0}>
            <Profile />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <UserComments />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <UserLikes />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <UserQuizzes />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
});
