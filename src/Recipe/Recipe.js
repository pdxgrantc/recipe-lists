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
        <h2>{recipesData.recipes[recipeTitle].title}</h2>
      </>
    )
  }
}
