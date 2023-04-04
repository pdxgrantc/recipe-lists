import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';

// Firebase
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'

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

  const [listsDoc, setListsDoc] = useState()

  useEffect(() => {
    const docRef = doc(db, "lists", user.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setListsDoc(docSnap.data())
      }
    });
  }, [user])


  return (
    // map listsDoc.lists
    <div className="flex flex-col w-[25%]">
      <h2>Your Lists</h2>
      {listsDoc?.lists.map((list) => {
        return (
          <p>test</p>
        )
      })}
    </div>
  )
}

function CreateList() {
  return (
    <div className='w-auto'>
      <h2>Create Recipe</h2>
    </div>
  )
}