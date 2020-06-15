import * as React from 'react';
import { GeneralLayout } from 'ui/cells/general-layout';
import { ContactLayout } from 'ui/cells/contact-layout';

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
