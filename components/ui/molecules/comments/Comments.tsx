import * as React from 'react';
import * as models from 'core/models';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { WithStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import { withTranslation } from 'server/lib/i18n';
import { getComments } from './operations';
import { withRouter } from 'next/router';
import { AddComment } from './AddComment';
import { Comment } from './Comment';
import { WithRouterProps } from 'next/dist/client/with-router';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: '600px',
    margin:' 0 auto',
    width: '100%',
    padding: '1rem',
  },
  wraper: {
    position: 'relative',
    minHeight: '90px',
    marginTop: '1rem'
  }
});


type Props = {
  blogs: any[] //FIXME:
} & WithStyles<typeof styles> & models.TranslationProps & WithRouterProps;

class CommnetsComponent extends React.PureComponent<Props> {

  componentDidMount() {
    getComments(String(this.props.router.query.id));
  }

  get content() {
    const blog = this.props.blogs.find(b => b.id === String(this.props.router.query.id));
    if (blog) {
      return blog.comments.map(c => (
        <Comment
          key={c.id}
          {...c}
        />
      ));
    }
    return null
  }

  render() {
    const { classes, t, router: { query } } = this.props;
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="body1">
          {t('gallery.comments')}
        </Typography>
        <Divider variant="fullWidth" />
        <div className={classes.wraper}>
          {this.content}
        </div>
        <AddComment blogId={String(query.id)} />
      </div>
    )
  }
}

export const Comments = compose(
  withStyles(styles),
  withTranslation('common'),
  withRouter
)(CommnetsComponent);
