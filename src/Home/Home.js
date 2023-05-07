import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'

// Firebase
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

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
          <h2 className="text-[2.25rem] font-semibold">Recent Recipes</h2>
          <div className="text-[1.5rem]">
            <RecipesList />
          </div>
        </div>
      </div>
    </div>
  )
}

function RecipesList() {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = useCallback(async () => {
    try {
      const recipesRef = collection(db, "users", user.uid, "recipes");
      const q = query(recipesRef, orderBy("lastEditedAt", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const recipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipes);
    } catch (error) {
      console.log(error);
    }
  }, [user.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "recipes"),
      () => {
        fetchRecipes();
      }
    );
    return () => unsubscribe();
  }, [fetchRecipes, user.uid]);

  const titleTruncate = (title) => {
    if (title.length <= 35) {
      return title
    }
    else {
      // truncate at the nearest word
      return title.substring(0, 35) + "..."
    }
  }

  if (!recipes) {
    return (
      <div className="text-[1.75rem] leading-8">Loading...</div>
    )
  }
  else {
    if (recipes.length === 0) {
      return (
        <div className="text-[1.75rem] leading-8 whitespace-nowrap">You have no recipes</div>
      )
    }
    else {
      return (
        <>
          <div>
            <div className='flex flex-col gap-2 h-fit'>
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]"
                  to={"/My-Recipes/" + recipe.title}>
                  {titleTruncate(recipe.title)}
                </Link>
              ))
              }
            </div>
          </div>
          <div className='h-6'></div>
          <Link to="/My-Recipes"
            className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]">
            All Recipes
          </Link>
        </>
      );
    }
  }
}
