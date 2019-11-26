import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'core/store';
import * as React from 'react';
import { appWithTranslation, i18next } from 'server/lib/i18n';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from 'core/lib';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getCookie } from 'core/cookieManager';
import { VisitorCookie } from 'core/models';
import('core/fire-callbacks');

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const lang = ctx.req
      ? ctx.req.cookies[VisitorCookie.Lang]
      : getCookie(VisitorCookie.Lang) || 'en';
    const curLang = (ctx.req && ctx.req.language) || i18next.language;
    const i18n = (ctx.req && ctx.req.i18n) || i18next;
    if (i18n && i18n.changeLanguage && curLang !== lang) {
      i18n.changeLanguage(lang);
    }

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return {
      pageProps
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
    const { Component, pageProps, store } = this.props as any;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <div>
            <Component {...pageProps} />
          </div>
        </Provider>
      </ThemeProvider>
    );
  }
}
export default withRedux(initStore)(appWithTranslation(MyApp));
