import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { GeneralLayout } from 'ui/index';
import { MeMainLayout } from 'ui/cells/me-layout';

class Me extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in profile fetch', e);
    }
  }

  render() {
    return (
      <GeneralLayout>
        <MeMainLayout />
      </GeneralLayout>
    );
  }
}

export default Me;
