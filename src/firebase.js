import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCy8rzc9cIa9dvU66qI7nblV1049xIda3Q",
    authDomain: "recipe-lists-aa6bb.firebaseapp.com",
    projectId: "recipe-lists-aa6bb",
    storageBucket: "recipe-lists-aa6bb.appspot.com",
    messagingSenderId: "348552446043",
    appId: "1:348552446043:web:99a03df3eac9c680a17f7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        // create users collection in firestore
        const userRef = doc(db, "users", result.user.uid);
        getDoc(userRef).then((docSnap) => {
            if (!docSnap.exists()) {
                setDoc(userRef, {
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid,
                    createdAt: new Date(),
                });
            }
        });
    }).catch((error) => {
        console.log(error);
    }
    ).then(() => {
        const docRef = doc(db, "recipes", auth.currentUser.uid);
        getDoc(docRef).then((docSnap) => {
            if (!docSnap.exists()) {
                setDoc(docRef, {
                    displayName: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                    uid: auth.currentUser.uid,
                    recipes: [],
                });
            }
        });
    }).catch((error) => {
        console.log(error);
    });
}

export const signOutUser = () => {
    signOut(auth);
}
