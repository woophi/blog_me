import { SeasonInfo } from 'core/models/admin';
import { ensureNotAuthorized } from 'core/operations/auth';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import * as React from 'react';
import { SeasonDetail } from 'ui/cells/admin/friendship';
import { getSeasonInfo } from 'ui/cells/admin/friendship/operations';
import { AdminLayout } from 'ui/cells/admin/layouts';

type localState = {
  seasonInfo: SeasonInfo;
};

class Season extends React.PureComponent<WithRouterProps, localState> {
  state: localState = {
    seasonInfo: undefined,
  };
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
      const seasonInfo = await getSeasonInfo();
      this.setState({ seasonInfo });
    } catch (e) {
      console.error('Error in Admin user detail fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <SeasonDetail seasonInfo={this.state.seasonInfo} />
      </AdminLayout>
    );
  }
}

export default withRouter(Season);
