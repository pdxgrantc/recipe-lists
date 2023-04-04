import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';

// Firebase
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, onSnapshot, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'

// Partials
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
            <div className='m-auto rounded-[10px] bg-black min-h-full w-[90%]'>
              <div className='flex gap-5 w-[100%] px-[4%] py-[3%]'>
                <MyMeals />
                <CreateList />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}


function MyMeals() {
  const [user] = useAuthState(auth);

  const [mealsData, setMealsData] = useState({});

  useEffect(() => {
    const mealsDocRef = doc(db, "meals", auth.currentUser.uid);
    const unsubscribe = onSnapshot(mealsDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMealsData(docSnapshot.data());
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser.uid]);

  /*
  const [mealsDoc, setMealsDoc] = useState()

  useEffect(() => {
    const docRef = doc(db, "meals", user.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setMealsDoc(docSnap.data())
      }
    });
  }, [user])
  */

  return (
    // map listsDoc.lists
    <div className="flex flex-col w-[25%]">
      <h2>Your Lists</h2>
      <ul>
        {mealsData.meals &&
          mealsData.meals.map((meals, index) => (
            <li key={index}>test</li>
          ))}
      </ul>
    </div>
  )

  return (
    <></>
  )
}

function CreateList() {
  return (
    <div className='w-auto'>
      <h2>Create Recipe</h2>
    </div>
  )
}