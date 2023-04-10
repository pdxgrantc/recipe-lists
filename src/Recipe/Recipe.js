import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import validator from 'validator';

// Firebase
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

// Partials
import Header from '../Static/Header/Header';
import Footer from '../Static/Footer/Footer';
import SignedOut from '../Static/SignedOut';

// SVGs
import { BiEditAlt as Pencil } from 'react-icons/bi';
import { BiSave as Save } from 'react-icons/bi';
import { ImCancelCircle as Cancel } from 'react-icons/im';
import { ReactComponent as Trashcan } from '../Static/SVG/Trashcan.svg';


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

  useEffect(() => {
    if (user) {
      const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
      const unsubscribe = onSnapshot(
        recipeDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setRecipeData(docSnapshot.data());
            setEditTitle(docSnapshot.data().title);
            setEditDescription(docSnapshot.data().description);
            setEditLink(docSnapshot.data().link);
          }
          else {
            setRecipeData({ title: null });
          }
        },
        (error) => {
          console.error(error);
        }
      );

      return () => unsubscribe();
    }
  }, [recipeTitle, user]);

  function confirmDelete() {
    let text = "Are you sure you want to delete this recipe.\nPress either OK or Cancel.";
    if (window.confirm(text) == true) {
      doDelete();
    } else {
      return;
    }
  }

  function doDelete() {
    // delete document at path 'users/{user.uid}/recipes/{recipeTitle}'
    const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
    deleteDoc(recipeDocRef)
    // route to home page
    window.location.href = '/';
  }

  function isValidUrl(url) {
    if ((validator.isURL(url)) && (url.startsWith("https://") || url.startsWith("http://"))) {
      return true
    } else {
      return false
    }
  }

  function isAlphaNumericWithSpaces(str) {
    return /^[a-zA-Z0-9\s]+$/.test(str);
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

  function setToDefault() {
    setEditTitle(recipeData.title);
    setEditDescription(recipeData.description);
    setEditLink(recipeData.link);
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
                <input type='text' value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className='font-semibold rounded-[4px] px-3 text-[2.75rem] h-auto w-[48rem] outline-none text-black' />
                <div className='flex my-auto pr-[2rem]'>
                  <button onClick={() => setBoolEdit(!editBool)} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                    <Cancel className='w-[2.25rem] h-[2.25rem]' />
                    <h4 className='text-2xl font-semibold'>Cancel</h4>
                  </button>
                  <button onClick={saveEdit} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                    <Save className='w-[2.25rem] h-[2.25rem]' />
                    <h4 className='text-2xl font-semibold'>Save</h4>
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-[.8rem]'>
                <input className='font-semibold rounded-[4px] px-3 text-[1.5rem] h-auto w-full outline-none text-black' type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <input className='font-semibold rounded-[4px] px-3 text-[1.25rem] h-auto w-auto outline-none text-black border-b-[1.5px] leading-8 py-[0]' type="text" value={editLink} onChange={(e) => setEditLink(e.target.value)} />
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
                    <div className='flex flex-col'>
                      <div>
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
                      </div>
                      <div className='flex gap-5'>
                        <div className='flex gap-3 my-auto'>
                          <input
                            className='font-semibold rounded-[4px] px-3 text-[1.25rem] h-fit w-auto outline-none text-black'
                            placeholder='Amount'>
                          </input>
                          <input
                            className='font-semibold rounded-[4px] px-3 text-[1.25rem] h-fit w-auto outline-none text-black'
                            placeholder='Item Name'>
                          </input>
                        </div>
                        <button
                          className="mb-[.1rem] whitespace-nowrap text-[1rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]">
                          <h4 className='text-2xl font-semibold'>Add</h4>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
}
