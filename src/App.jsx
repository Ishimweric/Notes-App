import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import { onSnapshot } from "firebase/firestore"
import { notesCollection } from "./firebase/firebase"

export default function App() {
    const [notes, setNotes] = React.useState(()=>JSON.parse(localStorage.getItem("notes"))|| [])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    function deleteNote(noteId) {
      setNotes((oldNotes)=> oldNotes.filter((oldNote)=> oldNote.id !== noteId))
    }

    function updateNote(text) {
      setNotes(oldNotes => {
        const updatedNotes = oldNotes.map(note =>
          note.id === currentNoteId
          ? { ...note, body: text } : note
        );

      const currentNote = updatedNotes.find(note => note.id === currentNoteId);

      // filter out the current note and move it on the top
      const rearranged = [
        currentNote,
        ...updatedNotes.filter(note => note.id !== currentNoteId)
      ];
      return rearranged;
      });
    }

    // localStorage.clear();
    // use effect to handle local storage when notes state changes
    useEffect(()=>{
      const unsubscribe = onSnapshot(notesCollection, (snapshot)=>{
        const notesArray = snapshot.docs.map((doc)=>({
          ...doc.data(),
          id: doc.id
        }))
        setNotes(notesArray);
      })
      return unsubscribe},
      []
    );

    const currentNote = notes.find(note =>  note.id === currentNoteId) || notes[0];
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote = {deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={currentNote} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
