import * as React from 'react';
import { ContactLayout, GeneralLayout } from 'ui/index';

class Contact extends React.PureComponent {
  render() {
    return (
      <GeneralLayout>
        <ContactLayout />
      </GeneralLayout>
    );
  }
}

export default Contact;
