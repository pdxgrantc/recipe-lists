import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Firebase
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Partials
import Header from '../Static/Header/Header';
import Footer from '../Static/Footer/Footer';
import SignedOut from '../Static/SignedOut';

// SVGs
import { ReactComponent as Pencil } from '../Static/SVG/Pencil.svg';
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
            <div className='flex gap-20 w-[100%] px-[4%] py-[3%]'>
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
  const [recipesData, setRecipesData] = useState({});
  var recipeTitle = window.location.pathname.split('/')[2];
  // replace every '%20' with ' ' in recipeTitle
  recipeTitle = recipeTitle.replace(/%20/g, ' ');

  useEffect(() => {
    if (user) {
      const recipesDocRef = doc(db, 'recipes', user.uid);
      const unsubscribe = onSnapshot(
        recipesDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setRecipesData(docSnapshot.data());
          }
        },
        (error) => {
          console.error(error);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  if (!recipesData.recipes || !recipesData.recipes[recipeTitle] || !recipesData.recipes[recipeTitle].title) {
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
          <title>{recipesData.recipes[recipeTitle].title}</title>
        </Helmet>
        <div className='flex flex-col gap-3 w-full'>
          <div className='flex justify-between on_desktop:w-[90%]'>
            <div>
              <h2 className='text-[2.75rem] font-semibold'>{recipesData.recipes[recipeTitle].title}</h2>
              <h3 className='text-[1.5rem] font-semibold'>{recipesData.recipes[recipeTitle].description}</h3>
            </div>
            <div className='flex my-auto'>
              <div className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                <Pencil className='w-[2.25rem] h-[2.25rem]' />
                <h4 className='text-2xl font-semibold'>Edit</h4>
              </div>
              <div className='flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem]'>
                <Trashcan className='w-[2.25rem] h-[2.25rem]' />
                <h4 className='text-2xl font-semibold'>Delete</h4>
              </div>
            </div>
          </div>
          <div>
            <h4 className='text-[1.75rem] font-semibold'>Ingredients</h4>
            <div className='pl-[1.5rem]'>
              {(recipesData.recipes[recipeTitle].ingredients.length === 0) ?
                <div>
                  <p className='text-[1.25rem]'>
                    No ingredients.
                  </p>
                </div>
                :
                <>
                  {recipesData.recipes[recipeTitle].ingredients.map((ingredient, index) => {
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
              {(recipesData.recipes[recipeTitle].steps.length === 0) ?
                <div>
                  <p className='text-[1.25rem]'>
                    No steps.
                  </p>
                </div>
                :
                <>
                  {recipesData.recipes[recipeTitle].steps.map((ingredient, index) => {
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
              {(recipesData.recipes[recipeTitle].notes.length === 0) ?
                <div>
                  <p className='text-[1.25rem]'>
                    No notes.
                  </p>
                </div>
                :
                <>
                  {recipesData.recipes[recipeTitle].notes.map((ingredient, index) => {
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
      </>
    )
  }
}
