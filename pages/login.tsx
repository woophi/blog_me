import * as React from 'react';
import { ensureAuthorized } from 'core/operations/auth';
import { connect as redux } from 'react-redux';
import { getUserFetching } from 'core/selectors';
import { AppState } from 'core/models';
import { GeneralLayout } from 'ui/cells/general-layout';
import { LoginLayout } from 'ui/cells/login-layout';
import { Spinner } from 'ui/atoms/spinner';

type Props = {
  userFetching: boolean;
};

class Login extends React.PureComponent<Props> {
  componentDidMount() {
    ensureAuthorized();
  }

  render() {
    return (
      <GeneralLayout>
        <LoginLayout />
        <Spinner isShow={this.props.userFetching} />
      </GeneralLayout>
    );
  }
}

export default redux((state: AppState) => ({
  userFetching: getUserFetching(state),
}))(Login);
