import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { AdminQuizResponseData } from 'core/models/admin';
import { AdminLayout } from 'ui/cells/admin/layouts';
import { getQuizData } from 'ui/cells/admin/quizzes/operations';
import dynamic from 'next/dynamic';

type localState = {
  quizData: AdminQuizResponseData;
};

const QuizForm = dynamic(() => import('ui/cells/admin/quizzes/QuizForm'), {
  ssr: false,
});

class EditQuiz extends React.PureComponent<WithRouterProps, localState> {
  state: localState = {
    quizData: undefined
  };
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
      const quizData = await getQuizData(Number(this.props.router.query.quizId));
      this.setState({ quizData });
    } catch (e) {
      console.error('Error in Admin EditQuiz fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <QuizForm
          quizId={Number(this.props.router.query.quizId)}
          initialValues={this.state.quizData}
        />
      </AdminLayout>
    );
  }
}

export default withRouter(EditQuiz);
