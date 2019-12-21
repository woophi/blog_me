import * as React from 'react';
import { BlogGuest } from 'core/models';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Like, Shares } from 'ui/molecules';
import { LoadComments } from './LoadComments';
import { getWindow } from 'core/common';
import { PopUp } from 'ui/molecules/blog-info-pop';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { SITE_URL } = publicRuntimeConfig;

type Props = {
  blog: BlogGuest;
};

export const BlogLayout = React.memo<Props>(({ blog }) => {
  const [pers, setPers] = React.useState<number>(null);
  const divRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const onePers = calcOnePersent();
    getWindow()?.document.addEventListener('scroll', () => scrollPers(onePers));
    return () =>
      getWindow()?.document.removeEventListener('scroll', () => scrollPers(onePers));
  });

  const calcOnePersent = () => {
    const rect = divRef.current.getBoundingClientRect();
    const a = rect.bottom; // dynamic
    const b = getWindow()?.innerHeight; // dynamic handle
    return (a - b + getWindow()?.scrollY) / 100;
  };

  const scrollPers = (onePers: number) => {
    const value = getWindow()?.scrollY / onePers;
    if (value > 1 && value < 100) {
      setPers(value);
    }
    if (value > 100) {
      setPers(null);
    }
    if (value > 0 && value < 1) {
      setPers(null);
    }
  };

  const scrollToElement = () => {
    getWindow()?.scrollTo(0, divRef.current.offsetTop);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Box minWidth="50vw" padding="1rem" maxWidth="720px">
        <Typography variant="h1" component="h1" gutterBottom>
          {blog.title}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          color="textSecondary"
        >
          Опубликовано: {moment(blog.publishedDate).format('DD MMMM YYYY HH:MM')}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          color="textSecondary"
        >
          Обновлено: {moment(blog.updatedAt).format('DD MMMM YYYY HH:MM')}
        </Typography>
      </Box>
      <img
        src={blog.coverPhotoUrl}
        alt={blog.title}
        style={{
          width: '100%',
          maxHeight: '100vh'
        }}
      />
      <Box minWidth="50vw" padding="1rem" maxWidth="720px">
        <Typography
          component="div"
          gutterBottom
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
      </Box>
      <Box display="flex">
        <Like blogId={blog.blogId} />
        <Shares
          linkToShare={`${SITE_URL}/post/${blog.title.toLowerCase()}-${blog.blogId}`}
        />
      </Box>
      <PopUp
        value={pers}
        linkToShare={`${SITE_URL}/post/${blog.title.toLowerCase()}-${blog.blogId}`}
        scrollToElement={scrollToElement}
      />
      <Box minWidth="50vw" padding="1rem" maxWidth="720px" marginBottom="2rem">
        <div ref={divRef} />
        <LoadComments commentsCount={blog.comments} blogId={blog.blogId} />
      </Box>
    </Box>
  );
});