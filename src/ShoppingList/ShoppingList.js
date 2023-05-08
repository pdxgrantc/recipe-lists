import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'

// Firebase
import { auth } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../firebase'
import { onSnapshot, doc, updateDoc } from 'firebase/firestore'

// Partials
import Header from '../Static/Header/Header'
import Footer from '../Static/Footer/Footer'
import SignedOut from '../Static/SignedOut'

// SVGs
import { ReactComponent as Trash } from '../Static/SVG/Trashcan.svg'

export default function ShoppingList() {
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
                    <title>Shopping List</title>
                </Helmet>
                <div className="bg-main_bg_color text-text_white min-h-[100vh] flex flex-col">
                    <Header />
                    <div className="w-full h-full basis-auto">
                        <div className='m-auto on_desktop:rounded-[10px] on_desktop:min-h-[80%] min-h-[85vh] bg-black on_desktop:w-[90%]'>
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

    const [shoppingList, setShoppingList] = useState([]);

    // get shopping list from firestore
    // it is a field in the user document
    // subscribe to changes

    useEffect(() => {
        const docRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setShoppingList(doc.data().shoppingList);
            } else {
                console.log("No such document!");
            }
        });
        return unsubscribe;
    }, [user.uid]);

    const deleteItem = async (index) => {
        // creater a copy of the shopping list
        let shoppingListCopy = [...shoppingList];

        // remove the item at the index
        shoppingListCopy.splice(index, 1);

        // update firestore
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
            shoppingList: shoppingListCopy
        });

        // update state
        setShoppingList(shoppingListCopy);
    }

    const clearList = async () => {
        // update firestore
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
            shoppingList: []
        });

        // update state
        setShoppingList([]);
    }

    return (
        <>
            <Helmet>
                <title>Shopping List</title>
            </Helmet>
            <div className="flex flex-col w-full">
                <div className='flex on_desktop:gap-10 on_mobile:justify-between w-full'>
                    <h2 className="on_mobile:hidden text-header font-semibold whitespace-nowrap align-middle">{user.displayName}'s Shopping List</h2>
                    <h2 className="on_desktop:hidden text-header font-semibold whitespace-nowrap align-middle">Shopping List</h2>
                    <>   {shoppingList.length !== 0 ?
                        <button className='my-auto w-fit text-small flex gap-2 cursor-pointer hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] py-[.5rem] h-fit' onClick={clearList}>
                            <h3 className="on_mobile:hidden font-semibold whitespace-nowrap my-auto">Clear List</h3>
                            <Trash className="w-auto on_desktop:h-[2.75rem] on_mobile:h-[2.75rem] my-auto" />
                        </button>
                        :
                        <></>
                    }
                    </>
                </div>
                <div>
                    <div className="text-small">
                        {shoppingList.length !== 0 ?
                            <div className='ml-4'>
                                {
                                    shoppingList.map((item, index) => (
                                        <div key={index} className='h-fit flex gap-1'>
                                            <div className="flex flex-row gap-3">
                                                <div className="">{item.amount}</div>
                                                <div className="">{item.name}</div>
                                            </div>
                                            <button onClick={() => deleteItem(index)}>
                                                <Trash className="w-auto h-[75%] on_desktop:hover:invert" />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <div className="text-base font-semibold">Your shopping list is empty</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}