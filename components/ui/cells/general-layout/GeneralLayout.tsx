import * as React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core';
import { ScrollButton } from 'ui/atoms';
import { Navigation } from './Navigation';

type Props = {
  title?: string;
  children: React.ReactNode;
}

export const GeneralLayout = React.memo<Props>(({ title = 'Красноглазый блог', children }) => {
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
      <div className={classes.content}>
        {children}
      </div>
      <ScrollButton />
    </>
  );
})

const useStyles = makeStyles(theme => ({
  content: {
    padding: '84px 0',
    minHeight: '100vh',
    overflowX: 'hidden',
    wordBreak: 'break-word'
  }
}));