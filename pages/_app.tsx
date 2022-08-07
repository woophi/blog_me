import { Provider } from 'react-redux';
import App from 'next/app';
import { wrapper, store } from 'core/store';
import * as React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from 'core/lib';
import { RouterProgress } from 'ui/atoms/RouterProgress';
import 'ui/atoms/spinner/spinner.css';
import 'ui/molecules/quill-editor/quill.css';
import 'core/fire-callbacks';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return {
      pageProps,
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('component ->', error, errorInfo);
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <RouterProgress />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store}>
            <div>
              <Component {...pageProps} />
            </div>
          </Provider>
        </ThemeProvider>
      </>
    );
  }
}

export default wrapper.withRedux(MyApp);
