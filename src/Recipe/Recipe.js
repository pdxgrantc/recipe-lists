import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

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
import { FaTrashAlt as Trash } from 'react-icons/fa';
import { BiSave as Save } from 'react-icons/bi';
// import { HiTrash as Trash } from 'react-icons/hi';
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

  const [recipeNotes, setRecipeNotes] = useState([]);
  const addNote = () => setRecipeNotes([...recipeNotes, ""]); // add a new object with empty strings to the items array

  const [recipeDescription, setRecipeDescription] = useState('');

  const [recipeImageURL, setRecipeImageURL] = useState('');

  const [recipeTitle, setRecipeTitle] = useState('Title');

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeIngredients];
    newIngredients[index][field] = value;
    setRecipeIngredients(newIngredients);
    console.log(recipeIngredients);
  };

  const deleteIngredient = (index) => {
    const newIngredients = [...recipeIngredients];
    newIngredients.splice(index, 1);
    setRecipeIngredients(newIngredients);
  }

  const handleInstructionChange = (index, value) => {
    const newInstruction = [...recipeInstructions];
    newInstruction[index] = value;
    setRecipeInstructions(newInstruction);
  };

  const deleteInstruction = (index) => {
    const newInstruction = [...recipeInstructions];
    newInstruction.splice(index, 1);
    setRecipeInstructions(newInstruction);
  }

  const handleNoteChange = (index, value) => {
    const newNote = [...recipeNotes];
    newNote[index] = value;
    setRecipeNotes(newNote);
  };

  const deleteNote = (index) => {
    const newNote = [...recipeNotes];
    newNote.splice(index, 1);
    setRecipeNotes(newNote);
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between w-full'>
        {!isEditing ?
          <h2 className='text-header font-semibold pr-12 whitespace-nowrap w-full'>{recipeTitle}</h2>
          :
          <input className='outline-none text-header text-black px-2 rounded-[4px] w-[60%]'
            type='text'
            placeholder='Recipe Title'
            value={recipeTitle}
            onChange={(event) => setRecipeTitle(event.target.value)}
          />
        }
        <div className='flex my-auto text-base'>
          {isEditing ?
            <>
              <button onClick={() => setIsEditing(!isEditing)} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                <Save className='my-auto w-auto h-[2rem]' />
                <h4 className='text-2xl font-semibold'>Save</h4>
              </button>
            </>
            :
            <>
              <button onClick={() => setIsEditing(!isEditing)} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                <Pencil className='my-auto w-auto h-[2rem]' />
                <h4 className='text-2xl font-semibold'>Edit</h4>
              </button>
            </>
          }
          <button className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
            <Trash className='my-auto w-auto h-[1.9rem]' />
            <h4 className='text-2xl font-semibold'>Delete</h4>
          </button>
        </div>
      </div>
      {isEditing ?
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col text-small'>
            <h3 className='text-small_header font-semibold'>Ingredients</h3>
            <div className='flex flex-col gap-2 mb-2 ml-3'>
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
                    <Trash className='my-auto'></Trash>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] hover:bg-button_accent_color hover:ease-[cubic-bezier(0.4, 0, 1, 1)] duration-[350ms] hover:px-[1.5vw] py-[.25rem]">
              Add Ingredient
            </button>
          </div>
          <div className='flex flex-col text-small'>
            <h3 className='text-small_header font-semibold'>Instructions</h3>
            <div className='flex flex-col gap-2 mb-2 ml-3'>
              {recipeInstructions.map((instruction, index) => (
                <div className='flex gap-3'>
                  <label key={index}>{index + 1}. </label>
                  <input
                    key={index}
                    value={instruction}
                    placeholder='Instruction'
                    onChange={(event) => handleInstructionChange(index, event.target.value)}
                    className='outline-none text-black px-2 rounded-[4px]'
                  />
                  <button
                    onClick={() => deleteInstruction(index)}
                    className='flex my-auto hover:invert'
                    type='button'>
                    <Trash className='my-auto'></Trash>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] hover:bg-button_accent_color hover:ease-[cubic-bezier(0.4, 0, 1, 1)] duration-[350ms] hover:px-[1.5vw] py-[.25rem]">
              Add Instruction
            </button>
          </div>
          <div className='flex flex-col text-small'>
            <h3 className='text-small_header font-semibold'>Notes</h3>
            <div className='flex flex-col gap-2 mb-2 ml-3'>
              {recipeNotes.map((note, index) => (
                <div className='flex gap-3'>
                  <label key={index}>{index + 1}. </label>
                  <input
                    key={index}
                    value={note}
                    placeholder='Note'
                    onChange={(event) => handleNoteChange(index, event.target.value)}
                    className='outline-none text-black px-2 rounded-[4px]'
                  />
                  <button
                    onClick={() => deleteNote(index)}
                    className='flex my-auto hover:invert'
                    type='button'>
                    <Trash className='my-auto'></Trash>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addNote}
              className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] hover:bg-button_accent_color hover:ease-[cubic-bezier(0.4, 0, 1, 1)] duration-[350ms] hover:px-[1.5vw] py-[.25rem]">
              Add Note
            </button>
          </div>
          <div className='flex flex-col gap-2 text-small'>
            <h3 className='text-small_header font-semibold'>Description</h3>
            <textarea
              className='w-full h-[10rem] outline-none text-black px-3 py-2 text-small rounded-[4px] ml-3'
              placeholder='Description'
              onChange={(event) => setRecipeDescription(event.target.value)}
              value={recipeDescription}>
            </textarea>
          </div>
        </div>
        :
        <div className='flex flex-col gap-5'>
          {!(recipeIngredients.length === 0) ?
            <>
              <div className='flex flex-col text-small'>
                <h3 className='text-small_header font-semibold'>Ingredients</h3>
                <div className='flex flex-col ml-3'>
                  {recipeIngredients.map((ingredient, index) => (
                    <div className='flex gap-3'>
                      <p key={index}>{index + 1}. {ingredient.amount}</p>
                      <p>{ingredient.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
            :
            <></>
          }
          {!(recipeInstructions.length === 0) ?
            <>
              <div className='flex flex-col text-small'>
                <h3 className='text-small_header font-semibold'>Instructions</h3>
                <div className='flex flex-col ml-3'>
                  {recipeInstructions.map((instruction, index) => (
                    <p key={index}>{index + 1}. {instruction}</p>
                  ))}
                </div>
              </div>
            </>
            :
            <></>
          }
          {!(recipeNotes.length === 0) ?
            <div className='flex flex-col text-small'>
              <h3 className='text-small_header font-semibold'>Notes</h3>
              <div className='flex flex-col ml-3'>
                {recipeNotes.map((note, index) => (
                  <p key={index}>{index + 1}. {note}</p>
                ))}
              </div>
            </div>
            :
            <></>
          }
          {!(recipeDescription === '') ?
            <div className='flex flex-col text-small'>
              <h3 className='text-small_header font-semibold'>Description</h3>
              <p className='w-full h-[10rem] text-small rounded-[4px] ml-3'>
                {recipeDescription}
              </p>
            </div>
            :
            <></>
          }
        </div>
      }
    </div >
  )
}
