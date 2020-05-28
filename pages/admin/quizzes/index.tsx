import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin/layouts';
import { AdminQuzzies } from 'ui/cells/admin/quizzes';

class Quizzes extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Admin Quiz fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <AdminQuzzies />
      </AdminLayout>
    );
  }
}

export default Quizzes;
