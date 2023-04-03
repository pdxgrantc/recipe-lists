import React from 'react'
import { Helmet } from 'react-helmet';

// Firebase
import { auth } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import SignedOut from "../Static/SignedOut"

// Partials
import Header from '../Static/Header/Header'
import Footer from '../Static/Footer/Footer'


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
              <MyLists />
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}


function MyLists() {
  return (
    <>
      <h2>Your Lists</h2>
      <div>
        
      </div>
    </>
  )
}