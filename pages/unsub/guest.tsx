import * as React from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { UnsubLayout } from 'ui/cells/unsub-layout';

class UnsubGuest extends React.PureComponent<WithRouterProps> {
  render() {
    return <UnsubLayout uniqId={String(this.props.router.query.id)} />;
  }
}

export default withRouter(UnsubGuest);
