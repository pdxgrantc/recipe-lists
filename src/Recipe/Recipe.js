import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
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
  const [recipesData, setRecipesData] = useState(null);
  const { recipeTitle } = useParams();


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
      <>
        <Helmet>
          <title>Recipe</title>
        </Helmet>
        <div className="bg-main_bg_color text-text_white h-[100vh] flex flex-col">
          <Header />
          <div className="w-full h-max basis-auto grow">
            <div className='m-auto rounded-[10px] h-[80%] bg-black w-[90%]'>
              <div className='flex gap-20 w-[100%] px-[4%] py-[3%]'>
                {recipesData.recipes !== null ? (
                  <div>
                    <h1></h1>
                  </div>
                ) : (
                  <>Loading...</>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}