import * as React from 'react';
import { getBLogs } from 'core/operations';
import { BlogGuestItem } from 'core/models';
import { GeneralLayout } from 'ui/cells/general-layout';
import { IndexLayout } from 'ui/cells/index-layout';

type Props = {
  blogs: BlogGuestItem[];
};
class Index extends React.Component<Props> {
  static async getInitialProps() {
    const blogs = await getBLogs();
    return { blogs };
  }

  static defaultProps = {
    blogs: []
  };

  state = {
    blogs: []
  };

  async componentDidMount() {
    if (!this.props.blogs || !this.props.blogs.length) {
      const blogs = await getBLogs();
      this.setState({ blogs });
    }
  }

  render() {
    const blogs = this.props.blogs.length ? this.props.blogs : this.state.blogs;
    return (
      <GeneralLayout>
        <IndexLayout blogs={blogs} />
      </GeneralLayout>
    );
  }
}

export default Index;
