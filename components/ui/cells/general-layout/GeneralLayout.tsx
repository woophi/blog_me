import { makeStyles } from '@material-ui/core';
import Head from 'next/head';
import * as React from 'react';
import { Footer } from 'ui/atoms/Footer';
import { ScrollButton } from 'ui/atoms/ScrollToTop';
import { Navigation } from './Navigation';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export const GeneralLayout = React.memo<Props>(
  ({ title = 'Красноглазый блог', children }) => {
    const classes = useStyles({});


    return (
      <>
        <Head>
          <title>{title}</title>
          <meta
            name="description"
            content="Красноглазный блог рассскажет просто и интеренсо о современных технологиях в мире IT/ИТ"
          />
          <meta name="keywords" content="ИТ, IT, вайти, красноглазик, блог айти" />
        </Head>
        <Navigation />
        <div className={classes.content}>{children}</div>
        <ScrollButton />
        <Footer  />
      </>
    );
  }
);

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '84px 0',
    minHeight: '100vh',
    overflowX: 'hidden',
    wordBreak: 'break-word',
  },
}));
