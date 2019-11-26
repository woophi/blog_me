import * as React from 'react';
import { PassUpdateLayout } from 'ui/index';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

class UpdatePass extends React.PureComponent<WithRouterProps> {
  render() {
    return <PassUpdateLayout linkId={String(this.props.router.query.id)} />;
  }
}

export default withRouter(UpdatePass);
