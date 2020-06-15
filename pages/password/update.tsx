import * as React from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { PassUpdateLayout } from 'ui/cells/pass-recovery';

class UpdatePass extends React.PureComponent<WithRouterProps> {
  render() {
    return <PassUpdateLayout linkId={String(this.props.router.query.id)} />;
  }
}

export default withRouter(UpdatePass);
