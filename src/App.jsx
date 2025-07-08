import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase/firebase"
import { setFlavor } from "showdown"

export default function App() {
    const [notes, setNotes] = React.useState([]);
    const [currentNoteId, setCurrentNoteId] = React.useState("");
    const [tempNoteText, setTempNoteText] = React.useState("");
    const sortedNotes = notes.sort((a,b)=>b.updatedAt - a.updatedAt)
    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection,newNote);
        setCurrentNoteId(newNoteRef.id)
    }

    async function deleteNote(noteId) {
      const docRef = doc(db, "notes", noteId);
      await deleteDoc(docRef);
    }

    async function updateNote(text) {
      const docRef = doc(db, "notes", currentNoteId);
      await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
    }

    const currentNote = notes.find(note =>  note.id === currentNoteId) || notes[0];

    useEffect(()=>{
      if(currentNote){
        setTempNoteText(currentNote.body)
      }
    },[currentNote]);

    useEffect(()=>{
      const timeOutId = setTimeout(() => {
        if (tempNoteText !== currentNote.body){
          updateNote(tempNoteText)
        }
      }, 500);
      return ()=> clearTimeout(timeOutId)
    },[tempNoteText])

    useEffect(()=>{
      if(!currentNoteId){
        setCurrentNoteId(notes[0]?.id)
      }
    },[notes]);

    // use effect to handle firebase storage when notes state changes
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
                  notes={sortedNotes}
                  currentNote={currentNote}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote = {deleteNote}
                />
                
                <Editor 
                  tempNoteText={tempNoteText} 
                  setTempNoteText={setTempNoteText}
                />
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
