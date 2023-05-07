import React, { useState } from 'react'

// Other Libraries
import validator from 'validator'

// Firebase
import { auth, db } from '../firebase'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'


export default function NewRecipe() {
    const [user] = useAuthState(auth)
    const [recipeTitle, setRecipeTitle] = useState('')
    const [recipeDescription, setRecipeDescription] = useState('')
    const [recipeLink, setRecipeLink] = useState('')

    function isAlphaNumericWithSpaces(str) {
        return /^[a-zA-Z0-9\s]+$/.test(str);
    }

    function isValidUrl(url) {
        if ((validator.isURL(url)) && (url.startsWith("https://") || url.startsWith("http://"))) {
            return true
        } else {
            return false
        }
    }

    const submitToDB = async (e) => {
        e.preventDefault();

        // ensure that the title is alphanumeric
        if (recipeTitle === '') {
            return alert('Please enter a title for your recipe');
        }
        if (!isAlphaNumericWithSpaces(recipeTitle)) {
            return alert('Please enter a title that is alphanumeric');
        }
        if (recipeLink.length !== 0) {
            if (isValidUrl(recipeLink) === false) {
                return alert('Please enter a valid URL\nmust start with https:// or http://');
            }
        } else if (recipeTitle.length > 75) {
            return alert('Please enter a title that is less than 35 characters');
        }

        const userDocRef = doc(db, 'users', user.uid);
        const recipesRef = collection(userDocRef, 'recipes');
        const recipeDocRef = doc(recipesRef, recipeTitle);

        try {
            const docSnapshot = await getDoc(recipeDocRef);
            if (docSnapshot.exists()) {
                alert('A recipe with that title already exists');
                setRecipeTitle('');
            } else {
                await setDoc(recipeDocRef, {
                    title: recipeTitle,
                    description: recipeDescription,
                    imgLink: recipeLink,
                    ingredients: [],
                    steps: [],
                    notes: [],
                    createdAt: new Date(),
                    lastEditedAt: new Date(),
                });
                setRecipeTitle('');
                setRecipeDescription('');
                setRecipeLink('');
            }
        } catch (error) {
            console.log('Error getting document:', error);
        }
    };

    const reset = (e) => {
        e.preventDefault()
        setRecipeTitle('')
        setRecipeDescription('')
        setRecipeLink('')
    }

    return (
        <div className='w-auto'>
            <h2 className='text-[3rem] font-semibold'>Create Recipe</h2>
            <div>
                <div className='flex flex-col gap-4 py-4'>
                    <input className="rounded-[4px] text-black w-[50vw] h-[5vh] text-[1.5rem] border-[1.5px] border-black focus:outline-none px-2"
                        type='text'
                        placeholder='Recipe Title (you cannot change this later)'
                        value={recipeTitle}
                        onChange={(e) => setRecipeTitle(e.target.value)}
                    />
                    <input className="rounded-[4px] text-black w-[50vw] h-[5vh] text-[1.5rem] border-[1.5px] border-black focus:outline-none px-2"
                        type='text'
                        placeholder='Recipe Description (optional)'
                        value={recipeDescription}
                        onChange={(e) => setRecipeDescription(e.target.value)}
                    />
                    <input className="rounded-[4px] text-black w-[50vw] h-[5vh] text-[1.5rem] border-[1.5px] border-black focus:outline-none px-2"
                        type='text'
                        placeholder='Recipe Image Link (optional)'
                        value={recipeLink}
                        onChange={(e) => setRecipeLink(e.target.value)}
                    />
                </div>
                <div className="flex on_desktop:gap-[1.25vw] on_mobile:gap-[2.5vh] on_mobile:flex-col">
                    <button onClick={submitToDB} className="cursor-pointer w-fit text-base border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.25vw] py-[.5vh]">Submit</button>
                    <button onClick={reset} className="cursor-pointer w-fit text-base border-b-[1.5px] on_desktop:hover:bg-button_accent_color on_desktop:hover:ease-[cubic-bezier(0.4, 0, 1, 1)] on_desktop:duration-[350ms] on_desktop:hover:px-[1.25vw] py-[.5vh]">Reset</button>
                </div>
            </div>
        </div>
    )
}