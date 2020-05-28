import * as React from 'react';
import { ensureNotAuthorized } from 'core/operations/auth';
import { AdminLayout } from 'ui/cells/admin/layouts';
import dynamic from 'next/dynamic';

const QuizForm = dynamic(import('ui/cells/admin/quizzes/QuizForm'), {
  ssr: false
});

class NewQuiz extends React.PureComponent {
  async componentDidMount() {
    try {
      await ensureNotAuthorized();
    } catch (e) {
      console.error('Error in Admin NewQuiz fetch', e);
    }
  }

  render() {
    return (
      <AdminLayout>
        <QuizForm />
      </AdminLayout>
    );
  }
}

export default NewQuiz;
