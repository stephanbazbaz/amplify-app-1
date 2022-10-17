import './App.css';
import { createNote, deleteNote } from './graphql/mutations'
import { listNotes } from './graphql/queries'
import { withAuthenticator, Button, Text, Flex, Heading } from "@aws-amplify/ui-react";
import { useCallback, useEffect, useState } from 'react';
import { API } from 'aws-amplify';

function App({ signOut }) {
  const [notes, setNotes] = useState([])
  const [value, setValue] = useState('')
  console.log(value);
  const fetchNotes = useCallback(async () => {
    const result = await API.graphql({
      query: listNotes,
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    setNotes(result.data.listNotes.items)
  }, [setNotes])

  const handleCreateNote = useCallback(async (value) => {
    console.log(value);
    await API.graphql({
      query: createNote,
      variables: { input: { text: value } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    fetchNotes()
  }, [fetchNotes])

  const handleDeleteNote = useCallback(async (id) => {
    await API.graphql({
      query: deleteNote,
      variables: { input: { id: id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    fetchNotes()
  }, [fetchNotes])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return (
    <Flex direction={"column"}>
      <Flex justifyContent={'space-between'}>
        <Heading level={1}>My notes</Heading>
        <Button onClick={signOut}>Sign Out</Button>
      </Flex>
      {notes.map((note, i) => <div key={i}> <Flex alignItems={'center'}>
        <Text>{note.text}</Text>
        <Button onClick={() => handleDeleteNote(note.id)}>Remove</Button>
      </Flex></div>)}
      <div className='form-container'>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={() => handleCreateNote(value)}>Add Note</Button>
      </div>
    </Flex>
  );
}

export default withAuthenticator(App);