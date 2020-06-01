import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin/layouts';
import { AdminQuzParticipants } from 'ui/cells/admin/quizzes';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

class Participants extends React.PureComponent<WithRouterProps> {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Admin Participants fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <AdminQuzParticipants quizId={Number(this.props.router.query.quizId)} />
      </AdminLayout>
    );
  }
}

export default withRouter(Participants);
