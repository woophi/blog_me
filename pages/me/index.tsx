import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { GeneralLayout } from 'ui/index';

class Me extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in profile fetch', e);
    }
  }

  render() {
    return <GeneralLayout>kek</GeneralLayout>;
  }
}

export default Me;
