import * as React from 'react';
import { BlogGuest, AppState } from 'core/models';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Like, Shares } from 'ui/molecules';
import { LoadComments } from './LoadComments';
import { getWindow } from 'core/common';
import { PopUp } from 'ui/molecules/blog-info-pop';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { getUserId } from 'core/selectors';
import 'ui/molecules/quill-editor/quill.css';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { increaseBlogView } from './operations';
const { publicRuntimeConfig } = getConfig();
const { SITE_URL } = publicRuntimeConfig;

type OwnProps = {
  blog: BlogGuest;
};

const mapState = (state: AppState, _: OwnProps) => ({
  userId: getUserId(state)
});

type Props = ReturnType<typeof mapState> & OwnProps;

const BlogLayoutPC = React.memo<Props>(({ blog, userId }) => {
  const [pers, setPers] = React.useState<number>(null);
  const [once, setOnce] = React.useState(false);
  const divRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const onePers = calcOnePersent();
    getWindow()?.document.addEventListener('scroll', () => scrollPers(onePers));
    return () =>
      getWindow()?.document.removeEventListener('scroll', () => scrollPers(onePers));
  });

  React.useEffect(() => {
    if (once) {
      increaseBlogView(blog.blogId);
    }
  }, [once, blog.blogId]);

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
      if (!once) {
        setOnce(true);
      }
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
        {blog.updatedAt ? (
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            color="textSecondary"
          >
            Обновлено: {moment(blog.updatedAt).format('DD MMMM YYYY HH:MM')}
          </Typography>
        ) : null}
      </Box>
      <picture>
        <source type="image/webp" data-srcset={blog.coverPhotoUrl + '.webp'} />
        <img
          alt={blog.title}
          data-src={blog.coverPhotoUrl + '.jpg'}
          style={{
            maxWidth: '100%',
            maxHeight: '100vh'
          }}
          className="lazyload"
        />
      </picture>
      <Box minWidth="50vw" padding="1rem" maxWidth="720px">
        <Typography component="div" gutterBottom>
          <div className="quill ">
            <div className="ql-snow">
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: blog.body }}
              />
            </div>
          </div>
        </Typography>
      </Box>
      <Box display="flex">
        {userId && <Like blogId={blog.blogId} />}
        <Shares
          linkToShare={`${SITE_URL}post/${blog.title.toLowerCase()}-${blog.blogId}`}
        />
      </Box>
      <PopUp
        value={pers}
        linkToShare={`${SITE_URL}post/${blog.title.toLowerCase()}-${blog.blogId}`}
        scrollToElement={scrollToElement}
      />
      <Box minWidth="50vw" padding="1rem" maxWidth="720px" marginBottom="2rem">
        <div ref={divRef} />
        <LoadComments commentsCount={blog.comments} blogId={blog.blogId} />
      </Box>
    </Box>
  );
});

export const BlogLayout = connect(mapState)(BlogLayoutPC);
