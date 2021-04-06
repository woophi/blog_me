import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { UserDetail } from 'core/models/admin';
import { AdminLayout } from 'ui/cells/admin/layouts';
import { getFriendUserDetail } from 'ui/cells/admin/friendship/operations';

type localState = {
  userDetail: UserDetail;
};

class FriendDetail extends React.PureComponent<WithRouterProps, localState> {
  state: localState = {
    userDetail: undefined,
  };
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
      const userDetail = await getFriendUserDetail(
        Number(this.props.router.query.vkUserId)
      );
      this.setState({ userDetail });
    } catch (e) {
      console.error('Error in Admin user detail fetch', e);
    }
  }

  render() {
    return <AdminLayout>{console.log(this.state.userDetail)}</AdminLayout>;
  }
}

export default withRouter(FriendDetail);
