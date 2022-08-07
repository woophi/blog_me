import * as React from 'react';
import { getBLogs } from 'core/operations';
import { BlogGuestItem } from 'core/models';
import { GeneralLayout } from 'ui/cells/general-layout';
import { IndexLayout } from 'ui/cells/index-layout';
import { GetServerSideProps } from 'next';

const IndexPage = ({ blogs }: { blogs: BlogGuestItem[] }) => {
  return (
    <GeneralLayout>
      <IndexLayout blogs={blogs} />
    </GeneralLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const blogs = await getBLogs();
    return {
      props: { blogs },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { blogs: [] },
    };
  }
};

export default IndexPage;
