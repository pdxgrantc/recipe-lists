import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'

// Firebase
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, onSnapshot } from 'firebase/firestore'

// Partials
import NewRecipe from './NewRecipe'
import Header from '../Static/Header/Header'
import Footer from '../Static/Footer/Footer'
import SignedOut from "../Static/SignedOut"


export default function Home() {
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
    )
  }
  else {
    return (
      <>
        <Helmet>
          <title>Recipes - Home</title>
        </Helmet>
        <div className="bg-main_bg_color text-text_white h-[100vh] flex flex-col">
          <Header />
          <div className="w-full h-max basis-auto grow">
            <div className='m-auto rounded-[10px] h-[80%] bg-black w-[90%]'>
              <div className='flex gap-20 w-[100%] px-[4%] py-[3%]'>
                <SideBar />
                <NewRecipe />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

function SideBar() {
  const [user] = useAuthState(auth);

  return (
    <div className="flex flex-col w-[30%]">
      <h3 className="text-[2.25rem] font-light">Welcome</h3>
      <h2 className="text-[2.75rem] font-semibold leading-10 pb-[2vh] whitespace-nowrap">{user.displayName}</h2>
      <div className="h-[1vh]"></div>
      <div className="min-h-[125px]">
        <div>
          <h2 className="text-[2.25rem] font-semibold">Your Recipes</h2>
          <div className="text-[1.5rem]">
            <MyMeals />
          </div>
        </div>
      </div>
    </div>
  )
}

function MyMeals() {
  const [user] = useAuthState(auth);

  const [recipesData, setRecipesData] = useState({});

  useEffect(() => {
    if (user) {
      const recipesDocRef = doc(db, "recipes", user.uid);
      const unsubscribe = onSnapshot(recipesDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setRecipesData(docSnapshot.data());
        }
      });

      return () => unsubscribe();
    }
  }, [user.uid]);

  if (!recipesData.recipes) {
    return (
      <div className="text-[1.75rem] leading-8">Loading...</div>
    )
  }
  else {
    if ((recipesData.recipes) && (recipesData.recipes.length === 0)) {
      return (
        <div className="text-[1.75rem] leading-8">You have no lists</div>
      )
    }
    else {
      return (
        <div>
          <ul className='flex flex-col gap-2'>
            {recipesData.recipes &&
              Object.entries(recipesData.recipes).map((recipe, index) => (
                <Link
                  key={index}
                  className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.25vw] py-[.25rem]"
                  to={"/My-Recipes/" + recipe.title}>
                  {recipe.title}
                </Link>
              ))
            }
          </ul>
        </div>
      )
    }
  }
}
