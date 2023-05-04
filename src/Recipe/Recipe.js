import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaTrashAlt } from 'react-icons/fa';

// Firebase
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';

// Partials
import Header from '../Static/Header/Header';
import Footer from '../Static/Footer/Footer';
import SignedOut from '../Static/SignedOut';

// Helper
import { isAlphaNumericWithSpaces, isValidUrl } from './helper';

// SVGs
import { BiEditAlt as Pencil } from 'react-icons/bi';
import { BiSave as Save } from 'react-icons/bi';
import { HiTrash as Trash } from 'react-icons/hi';
import { ImCancelCircle as Cancel } from 'react-icons/im';
import { ReactComponent as Trashcan } from '../Static/SVG/Trashcan.svg';


export default function Recipe() {
  const [user] = useAuthState(auth);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <>
        <div className="mx-auto bg-main_bg_color text-text_white min-h-[100vh] flex flex-col">
          <Header />
          <div className="w-full basis-auto grow">
            <div className='mx-auto w-fit'>
              <SignedOut />
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <Helmet>
          <title>Create Recipe</title>
        </Helmet>
        <div className="bg-main_bg_color text-text_white min-h-[100vh] flex flex-col">
          <Header />
          <div className="w-full basis-auto grow">
            <div className='m-auto rounded-[10px] h-[80%] bg-black w-[90%]'>
              <div className='flex gap-20 w-full px-[4%] py-[3%]'>
                <Content />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

function Content() {
  const [isEditing, setIsEditing] = useState(true); // TODO change to false
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const addIngredient = () => setRecipeIngredients([...recipeIngredients, { amount: "", name: "" }]); // add a new object with empty strings to the items array
  const [recipeInstructions, setRecipeInstructions] = useState([]);
  const addInstruction = () => setRecipeInstructions([...recipeInstructions, ""]); // add a new object with empty strings to the items array
  const [recipeDescription, setRecipeDescription] = useState('');

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeIngredients];
    newIngredients[index][field] = value;
    setRecipeIngredients(newIngredients);
  };

  const deleteIngredient = (index) => {
    const newIngredients = [...recipeIngredients];
    newIngredients.splice(index, 1);
    setRecipeIngredients(newIngredients);
  }

  const handleInstructionChange = (index, field, value) => {
    const newInstruction = [...recipeInstructions];
    newInstruction[index][field] = value;
    setRecipeInstructions(newInstruction);
  };

  const deleteInstruction = (index) => {
    const newInstruction = [...recipeInstructions];
    newInstruction.splice(index, 1);
    setRecipeInstructions(newInstruction);
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between w-full'>
        <h2 className='text-[2.75rem] font-semibold pr-12 whitespace-nowrap w-full'>Title</h2>
        <div className='flex my-auto'>
          <button onClick={() => setIsEditing(!isEditing)} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
            <Pencil className='w-[2.25rem] h-[2.25rem]' />
            <h4 className='text-2xl font-semibold'>Edit</h4>
          </button>
          <button className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
            <Trashcan className='w-[2.25rem] h-[2.25rem]' />
            <h4 className='text-2xl font-semibold'>Delete</h4>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2 text-[1.75rem]'>
          <h3 className='text-[2.25rem] font-semibold'>Ingredients</h3>
          {recipeIngredients.map((ingredient, index) => (
            <div className='flex gap-3'>
              <div className='flex gap-2'>
                <label key={index}>{index + 1}. </label>
                <input
                  key={index}
                  value={ingredient.amount}
                  placeholder='Amount'
                  onChange={(event) => handleIngredientChange(index, "amount", event.target.value)}
                  className='outline-none text-black px-2 rounded-[4px]'
                />
                <input
                  key={index}
                  value={ingredient.name}
                  placeholder='Name of ingredient'
                  onChange={(event) => handleIngredientChange(index, "name", event.target.value)}
                  className='outline-none text-black px-2 rounded-[4px]'
                />
              </div>
              <button
                onClick={() => deleteIngredient(index)}
                className='flex my-auto hover:invert'
                type='button'>
                <FaTrashAlt className='my-auto'></FaTrashAlt>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] hover:bg-button_accent_color hover:ease-[cubic-bezier(0.4, 0, 1, 1)] duration-[350ms] hover:px-[1.5vw] py-[.25rem]">
            Add Ingredient
          </button>
        </div>
        <div className='flex flex-col gap-2 text-[1.75rem]'>
          <h3 className='text-[2.25rem] font-semibold'>Ingredients</h3>
          {recipeInstructions.map((instruction, index) => (
            <div className='flex gap-3'>
              <label key={index}>{index + 1}. </label>
              <input
                key={index}
                value={instruction.amount}
                placeholder='Instruction'
                onChange={(event) => handleInstructionChange(index, "amount", event.target.value)}
                className='outline-none text-black px-2 rounded-[4px]'
              />
              <button
                onClick={() => deleteInstruction(index)}
                className='flex my-auto hover:invert'
                type='button'>
                <FaTrashAlt className='my-auto'></FaTrashAlt>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] hover:bg-button_accent_color hover:ease-[cubic-bezier(0.4, 0, 1, 1)] duration-[350ms] hover:px-[1.5vw] py-[.25rem]">
            Add Instruction
          </button>
        </div>
        <div>
          <h4>Description</h4>
          <textarea
          className='w-full h-[10rem]'
          placeholder='Description'
          value={recipeDescription}
          ></textarea>
        </div>
      </div>
    </div>
  )
}

/*
export default function Recipe() {
  const [user] = useAuthState(auth);

  if (!user) {
    return (
      <>
        <div className="mx-auto bg-main_bg_color text-text_white min-h-[100vh] flex flex-col">
          <Header />
          <div className="w-full basis-auto grow">
            <div className='mx-auto w-fit'>
              <SignedOut />
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  } else {
    return (
      <div className="bg-main_bg_color text-text_white h-[100vh] flex flex-col">
        <Header />
        <div className="w-full min-h-max h-auto basis-auto grow">
          <div className='m-auto rounded-[10px] min-h-[80%] bg-black w-[90%]'>
            <div className='flex gap-20 w-full px-[4%] py-[3%] mx-auto'>
              <Content />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}


function Content() {
  const [user] = useAuthState(auth);
  const [recipeData, setRecipeData] = useState();
  const [editBool, setBoolEdit] = useState(false);
  const rawRecipeTitle = window.location.pathname.split('/')[2];
  var recipeTitle = rawRecipeTitle.replace(/%20/g, ' ');

  // edit values
  const [editTitle, setEditTitle] = useState();
  const [editDescription, setEditDescription] = useState();
  const [editLink, setEditLink] = useState();
  const [editIngredients, setEditIngredients] = useState([]);
  const [editInstructions, setEditInstructions] = useState([]);
  const [editNotes, setAddNotes] = useState([]);

  useEffect(() => {
    if (user) {
      const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
      const unsubscribe = onSnapshot(
        recipeDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            // After the document is retrieved, set the local state with the data
            setRecipeData(docSnapshot.data());
            setEditTitle(docSnapshot.data().title);
            setEditDescription(docSnapshot.data().description);
            setEditLink(docSnapshot.data().link);
            setEditIngredients(docSnapshot.data().ingredients);
            setEditInstructions(docSnapshot.data().instructions);
          }
          else {
            // If the document does not exist, set the local state to null to route to 404
            setRecipeData({ title: null });
          }
        },
        (error) => {
          // other error states
          console.error(error);
        }
      );
      // Unsubscribe from the document on unmount
      return () => unsubscribe();
    }
  }, [recipeTitle, user]);

  // react function to handle the deletion of a recipe
  function confirmDelete() {
    let text = "Are you sure you want to delete this recipe.\nPress either OK or Cancel.";
    if (window.confirm(text) === true) {
      // delete document at path 'users/{user.uid}/recipes/{recipeTitle}'
      const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
      deleteDoc(recipeDocRef)
      // route to home page
      window.location.href = '/';
      return;
    } else {
      return;
    }
  }

  function saveEdit() {
    if (editTitle === '') {
      return alert('Please enter a title for your recipe')
    }
    if (!isAlphaNumericWithSpaces(editTitle)) {
      return alert('Please enter a title that is alphanumeric')
    }
    if (editTitle.length > 35) {
      return alert('Please enter a title that is less than 35 characters')
    }
    // update document at path 'users/{user.uid}/recipes/{recipeTitle}'
    const recipeDocRef = doc(db, 'users', user.uid, 'recipes', editTitle);
    if ((editLink.length !== 0)) {
      if (isValidUrl(editLink) === false) {
        return alert('Please enter a valid URL\nmust start with https:// or http://')
      }
    }
    updateDoc(recipeDocRef, {
      title: editTitle,
      description: editDescription,
      link: editLink,
      lastEditedAt: new Date(),
    })
    // set edit bool to false
    setBoolEdit(!editBool);
  }

  const addNote = () => {
    if (editNotes === '') {
      return alert('Your note cannot be empty.')
    }
    else {
      const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
      const newNotes = [...recipeData.notes, editNotes];
      updateDoc(recipeDocRef, {
        notes: newNotes,
      });
      setAddNotes('');
    }
  }

  const deleteNote = async (index) => {
    const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
    updateDoc(recipeDocRef, {
      notes: arrayRemove(recipeData.notes[index]),
    })
  }

  if (!recipeData) {
    return (
      <>
        <Helmet>
          Loading...
        </Helmet>
        Loading...
      </>
    );
  }
  else if (recipeData.title === null) {
    // route to 404 page
    window.location.href = '/404';
  }
  else {
    if (!editBool) {
      return (
        <>
          <Helmet>
            <title>{recipeData.title}</title>
          </Helmet>
          <div className='flex flex-col gap-7 w-full px-6'>
            <div className='flex flex-col gap-3 w-full'>
              <div className='flex justify-between gap-5'>
                <h2 className='text-[2.75rem] font-semibold pr-12 whitespace-nowrap w-full'>{recipeData.title}</h2>
                <div className='flex my-auto'>
                  <button onClick={() => setBoolEdit(!editBool)} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                    <Pencil className='w-[2.25rem] h-[2.25rem]' />
                    <h4 className='text-2xl font-semibold'>Edit</h4>
                  </button>
                  <button onClick={confirmDelete} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                    <Trashcan className='w-[2.25rem] h-[2.25rem]' />
                    <h4 className='text-2xl font-semibold'>Delete</h4>
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-[.6rem]'>
                <h3 className='text-[1.5rem] font-semibold'>{recipeData.description}</h3>
                <a href={recipeData.link} target="_blank" rel="noopener noreferrer">
                  <h3
                    className="whitespace-nowrap text-[1.25rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]">
                    {recipeData.title + " link"}
                  </h3>
                </a>
              </div>
            </div>
            <div>
              <div>
                <h4 className='text-[1.75rem] font-semibold'>Ingredients</h4>
                <div className='pl-[1.5rem]'>
                  {(recipeData.ingredients.length === 0) ?
                    <div>
                      <p className='text-[1.25rem]'>
                        No ingredients.
                      </p>
                    </div>
                    :
                    <>
                      {recipeData.ingredients.map((ingredient, index) => {
                        return (
                          <div key={index}>
                            <p className='text-[1.25rem]'>
                              {index + 1}.&nbsp;&nbsp;
                              {ingredient}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  }
                </div>
              </div>
              <div>
                <h4 className='text-[1.75rem] font-semibold'>Steps</h4>
                <div className='pl-[1.5rem]'>
                  {(recipeData.steps.length === 0) ?
                    <div>
                      <p className='text-[1.25rem]'>
                        No steps.
                      </p>
                    </div>
                    :
                    <>
                      {recipeData.steps.map((ingredient, index) => {
                        return (
                          <div key={index}>
                            <p className='text-[1.25rem]'>
                              {index + 1}.&nbsp;&nbsp;
                              {ingredient}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  }
                </div>
              </div>
              <div>
                <h4 className='text-[1.75rem] font-semibold'>Notes</h4>
                <div className='pl-[1.5rem]'>
                  {(recipeData.notes.length === 0) ?
                    <div>
                      <p className='text-[1.25rem]'>
                        No notes.
                      </p>
                    </div>
                    :
                    <>
                      {recipeData.notes.map((ingredient, index) => {
                        return (
                          <div key={index}>
                            <p className='text-[1.25rem]'>
                              {index + 1}.&nbsp;&nbsp;
                              {ingredient}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <Helmet>
            <title>{recipeData.title}</title>
          </Helmet>
          <div className='pl-3 flex flex-col gap-7 w-full'>
            <div className='flex flex-col gap-3 w-full pb-[4px]'>
              <div className='flex justify-between gap-5 w-full'>
                <input
                  type='text'
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className='font-semibold rounded-[4px] px-3 text-[2.75rem] h-auto w-[48rem] outline-none text-black' />
                <div className='flex my-auto pr-[2rem]'>
                  <button
                    onClick={() => setBoolEdit(!editBool)}
                    className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                    <Cancel className='w-[2.25rem] h-[2.25rem]' />
                    <h4 className='text-2xl font-semibold'>Close</h4>
                  </button>
                  <button
                    onClick={saveEdit}
                    className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                    <Save className='w-[2.25rem] h-[2.25rem]' />
                    <h4 className='text-2xl font-semibold'>Save</h4>
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-[.8rem]'>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className='font-semibold rounded-[4px] px-3 text-[1.5rem] h-auto w-full outline-none text-black' />
                <input
                  type="text"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className='font-semibold rounded-[4px] px-3 text-[1.25rem] h-auto w-auto outline-none text-black border-b-[1.5px] leading-8 py-[0]' />
              </div>
            </div>
            <div className='px-3'>
              <div>
                <h4 className='text-[1.75rem] font-semibold'>Ingredients</h4>
                <div className='pl-[1.5rem]'>
                  {(recipeData.ingredients.length === 0) ?
                    <div>
                      <p className='text-[1.25rem]'>
                        No ingredients.
                      </p>
                    </div>
                    :
                    <>
                      {editIngredients.map((ingredient, index) => {
                        return (
                          <div key={index}>
                            <p className='text-[1.25rem]'>
                              {index + 1}.&nbsp;&nbsp;
                              {ingredient}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  }
                </div>
              </div>
              <div>
                <h4 className='text-[1.75rem] font-semibold'>Steps</h4>
                <div className='pl-[1.5rem]'>
                  {(recipeData.steps.length === 0) ?
                    <div>
                      <p className='text-[1.25rem]'>
                        No steps.
                      </p>
                    </div>
                    :
                    <>
                      {editInstructions.map((instruction, index) => {
                        return (
                          <div key={index}>
                            <p className='text-[1.25rem]'>
                              {index + 1}.&nbsp;&nbsp;
                              {instruction}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  }
                </div>
              </div>
              <div>
                <h4 className='text-[1.75rem] font-semibold'>Notes</h4>
                <div className='pl-[1.5rem]'>
                  <div className='flex flex-col'>
                    <div>
                      {recipeData.notes.map((note, index) => {
                        return (
                          <div key={index} className='flex gap-2 my-auto'>
                            <p className='text-[1.25rem]'>
                              {index + 1}.&nbsp;&nbsp;
                              {note}
                            </p>
                            <button onClick={() => deleteNote(index)} onMouseOver={({ target }) => target.style.color = "red"} onMouseOut={({ target }) => target.style.color = "white"}>
                              <Trash className='my-auto w-6 h-auto hover:invert-1' ></Trash>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className='flex gap-5'>
                      <div className='flex gap-3 my-auto w-[50%] min-w-[50rem]'>
                        <input
                          type="text"
                          onChange={(e) => setAddNotes(e.target.value)}
                          className='font-semibold rounded-[4px] px-3 text-[1.25rem] h-fit w-full outline-none text-black'
                          placeholder='Note'>
                        </input>
                      </div>
                      <button
                        onClick={addNote}
                        className="mb-[.1rem] whitespace-nowrap text-[1rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]">
                        <h4 className='text-2xl font-semibold'>Add</h4>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
}
*/