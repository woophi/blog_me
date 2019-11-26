import * as React from 'react';
import { UnsubLayout } from 'ui/index';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

class UnsubGuest extends React.PureComponent<WithRouterProps> {
  render() {
    return <UnsubLayout uniqId={String(this.props.router.query.id)} />;
  }
}

export default withRouter(UnsubGuest);
