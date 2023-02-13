import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import MyContactList from '../MyContactList/MyContactList.jsx';
import MyContactFilter from '../MycontactFilter/MyContactFilter.jsx';
import MyContactForm from '../MyContcatForm/MyContactForm.jsx';

import styles from './my-contacts.module.css';

const MyContacts = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(localStorage.getItem('my contacts'));
    return contacts?.length ? contacts : [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('my contacts', JSON.stringify(contacts));
  }, [contacts]);

  const isDublicate = (name, number) => {
    const normalizedTitle = name.toLowerCase();
    const normalizedAuthor = number.toLowerCase();
    const result = contacts.find(({ name, number }) => {
      return (
        name.toLowerCase() === normalizedTitle ||
        number.toLowerCase() === normalizedAuthor
      );
    });
    return result;
  };

  const addContact = ({ name, number }) => {
    if (isDublicate(name, number)) {
      alert(`${name}. Contact: ${number} is already present`);
      return;
    }

    setContacts(prevContacts => {
      const newContact = {
        id: nanoid(),
        name: name,
        number: number,
      };
      return [newContact, ...contacts];
    });
    return;
  };

  const deleteContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const handlFilter = ({ target }) => setFilter(target.value);

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }

    const normalizedFilter = filter.toLocaleLowerCase();
    const result = contacts.filter(
      ({ name, number }) =>
        name.toLocaleLowerCase().includes(normalizedFilter) ||
        number.toLocaleLowerCase().includes(normalizedFilter)
    );
    return result;
  };

  const filteredContacts = getFilteredContacts();

  return (
    <div>
      <h3 className={styles.title}>My contacts</h3>
      <div className={styles.wrapper}>
        <div className={styles.block}>
          <h4 className={styles.title}>Name</h4>
          <MyContactForm onSubmit={addContact} />
        </div>
        <div className={styles.block}>
          <h4 className={styles.title}>Contacts</h4>
          <MyContactFilter handlFilter={handlFilter} />
          <MyContactList
            deleteContact={deleteContact}
            contacts={filteredContacts}
          />
          {!filteredContacts.length && (
            <p className={styles.message}>No contacts in the list</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyContacts;
