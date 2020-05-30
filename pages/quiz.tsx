import * as React from 'react';
import { GeneralLayout } from 'ui/index';
import { getQuiz } from 'core/operations';
import { QuizGuestData } from 'core/models';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import isEmpty from 'ramda/src/isEmpty';
import or from 'ramda/src/or';
import isNil from 'ramda/src/isNil';
import { NextPageContext } from 'next';
import { QuizLayout } from 'ui/cells';
import Head from 'next/head';
import getConfig from 'next/config';
import Error from './_error';
const { publicRuntimeConfig } = getConfig();
const { SITE_URL } = publicRuntimeConfig;

type Props = {
  quiz: QuizGuestData;
} & WithRouterProps;
class Quiz extends React.Component<Props> {
  static async getInitialProps(context: NextPageContext) {
    try {
      const quiz = await getQuiz(Number(context.query.quizId));
      return { quiz };
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  static defaultProps: Partial<Props> = {
    quiz: null,
  };

  state = {
    quiz: {} as QuizGuestData,
  };

  async componentDidMount() {
    if (or(isEmpty(this.props.quiz), isNil(this.props.quiz))) {
      const quiz = await getQuiz(Number(this.props.router.query.quizId));
      this.setState({ quiz });
    }
  }

  render() {
    const quiz = or(isEmpty(this.props.quiz), isNil(this.props.quiz))
      ? this.state.quiz
      : this.props.quiz;

    if (or(isEmpty(quiz), isNil(quiz))) {
      return <Error statusCode={404} err={''} />;
    }

    const { title, quizId, subtitle } = quiz;
    return (
      <>
        <Head>
          <meta property="og:url" content={`${SITE_URL}quiz/${quizId}`} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={subtitle} />
        </Head>
        <GeneralLayout>
          <QuizLayout quizData={quiz} />
        </GeneralLayout>
      </>
    );
  }
}

export default withRouter(Quiz);
