import React, { Fragment, useContext } from 'react'
import ContactItem from './ContactItem'
import ContactContext from '../../context/contact/contactContext';

const Contacts = () => {
  // Gives access to any state or action within the context
  const contactContext = useContext(ContactContext);

  const { contacts } = contactContext;

  return (
    <Fragment>
      {contacts.map(contact => (
      <ContactItem key={contact.id} contact={contact} />
      ))}
    </Fragment>
  );
}

export default Contacts
