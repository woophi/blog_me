import * as React from 'react';

type Props = {
  children?: React.ReactChild;
};
export const AdminLayout = React.memo<Props>(({ children }) => {
  return <div>{children}</div>;
});
