import * as React from 'react';
import { Spinner, GeneralLayout, LoginLayout } from 'ui/index';
import { ensureAuthorized } from 'core/operations/auth';
import { connect as redux } from 'react-redux';
import { getUserFetching } from 'core/selectors';
import { AppState } from 'core/models';

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
  userFetching: getUserFetching(state)
}))(Login);
