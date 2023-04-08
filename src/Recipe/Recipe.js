import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Firebase
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';

// Partials
import Header from '../Static/Header/Header';
import Footer from '../Static/Footer/Footer';
import SignedOut from '../Static/SignedOut';

// SVGs
import { BiEditAlt as Pencil } from 'react-icons/bi';
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
        <div className="w-full h-max basis-auto grow">
          <div className='m-auto rounded-[10px] h-[80%] bg-black w-[90%]'>
            <div className='flex gap-20 w-full px-[4%] py-[3%]'>
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
  const rawRecipeTitle = window.location.pathname.split('/')[2];
  var recipeTitle = rawRecipeTitle.replace(/%20/g, ' ');

  useEffect(() => {
    if (user) {
      const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeTitle);
      const unsubscribe = onSnapshot(
        recipeDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setRecipeData(docSnapshot.data());
          }
        },
        (error) => {
          console.error(error);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  async function deleteRecipe() {
    try {
      await deleteDoc(doc(db, "users", user.uid, 'recipes', recipeTitle));
      // redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error(`Error deleting recipe with ID ${recipeTitle}:`, error);
    }
  }

  const openLinkInNewTab = () => {
    var url = recipeData.link;
    // check if first part of recipeData.link is 'https://'
    if ((!recipeData.link.startsWith('https://')) || (!recipeData.link.startsWith('http://'))) {
      url = 'http://' + url;
    }
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
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
  else {
    return (
      <>
        <Helmet>
          <title>{recipeData.title}</title>
        </Helmet>
        <div className='flex flex-col gap-7'>
          <div className='flex flex-col gap-3 w-full'>
            <div className='flex justify-between gap-5 on_desktop:w-[90%]'>
              <h2 className='text-[2.75rem] font-semibold whitespace-nowrap'>{recipeData.title}</h2>
              <div className='flex my-auto'>
                <div className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                  <Pencil className='w-[2.25rem] h-[2.25rem]' />
                  <h4 className='text-2xl font-semibold'>Edit</h4>
                </div>
                <div onClick={deleteRecipe} className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                  <Trashcan className='w-[2.25rem] h-[2.25rem]' />
                  <h4 className='text-2xl font-semibold'>Delete</h4>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <h3 className='text-[1.5rem] font-semibold'>{recipeData.description}</h3>
              <h3
                className="whitespace-nowrap text-[1.25rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]"
                onClick={openLinkInNewTab}>
                {recipeData.title + " link"}
              </h3>
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
}
