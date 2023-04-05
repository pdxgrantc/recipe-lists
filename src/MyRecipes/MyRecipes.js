import React from 'react'
import { Helmet } from 'react-helmet';

// Firebase
import { auth } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

// Partials
import Header from '../Static/Header/Header'
import Footer from '../Static/Footer/Footer'
import SignedOut from "../Static/SignedOut"


export default function MyRecipes() {
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
                                <Content />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        )
    }
}

function Content() {
    const [user] = useAuthState(auth);

    return (
        <>
            <div className="flex flex-col w-[30%]">
                <h3 className="text-[2.25rem] font-light">Welcome</h3>
                <h2 className="text-[2.75rem] font-semibold leading-10 pb-[2vh] whitespace-nowrap">{user.displayName}'s Recipes</h2>
            </div>
        </>
    )
}