import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'

// Firebase
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore'

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
    const [recipesData, setRecipesData] = useState({});

    useEffect(() => {
        const q = query(collection(db, "users", user.uid, "recipes"), orderBy("lastEditedAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setRecipesData({ recipes: data });
        });
        return unsubscribe;
    }, [user]);

    console.log(recipesData.recipes);

    if (!recipesData.recipes) {
        return (
            <>
                <Helmet>
                    Loading...
                </Helmet>
                <div className="flex flex-col w-[30%]">
                    <h2 className="text-[2.75rem] font-semibold leading-10 pb-[2vh] whitespace-nowrap">{user.displayName}'s Recipes</h2>
                    <h3 className='text-[1.6rem] font-semibold'>Loading...</h3>
                </div>
            </>
        );
    }
    else {
        if (recipesData.recipes.length === 0) {
            return (
                <div className='flex flex-col gap-6 w-[80%] ml-0'>
                    <div className="flex flex-col w-[100%]">
                        <h2 className="text-[2.75rem] font-semibold leading-10 pb-[.5vh] whitespace-nowrap">{user.displayName}'s Recipes</h2>
                    </div>
                    <div className='on_desktop:flex flex-col gap-2 w-full'>
                        <h3 className='text-[1.6rem] font-semibold'>You have no recipes yet.</h3>
                        <Link
                            className="whitespace-nowrap text-[1.6rem] leading-8 cursor-pointer w-fit border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.5vw] py-[.25rem]"
                            to='/'>
                            Create Recipe
                        </Link>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='flex flex-col gap-6 w-[80%] ml-0'>
                    <div className="flex flex-col w-[100%]">
                        <h2 className="text-[2.75rem] font-semibold leading-10 pb-[2vh] whitespace-nowrap">{user.displayName}'s Recipes</h2>
                    </div>
                    <div className='on_desktop:grid grid-cols-2 on_mobile:flex on_mobile:flex-col gap-5 w-full'>
                        {recipesData.recipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                className="w-full rounded-[4px] p-3 border-[2px] border-text_white hover:bg-apps_bg_pressed hover:border-transparent"
                                to={"/My-Recipes/" + recipe.title}>
                                <h4 className='whitespace-nowrap text-[1.6rem]'>{recipe.title}</h4>
                                <h5>{recipe.description}</h5>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        }
    }
}