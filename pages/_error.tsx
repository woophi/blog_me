import * as React from 'react';
import { ErrorLayout } from 'ui/index';

type Props = {
  statusCode: number;
  err: any;
};

const Error: React.FC<Props> = props => {
  return <ErrorLayout {...props} />;
};

(Error as any).getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode, err };
};

export default Error;
