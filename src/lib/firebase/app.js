// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { FIREBASE_CONFIG } from '$env/static/private';

const firebaseConfig = JSON.parse(FIREBASE_CONFIG);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// TODO: look into enabling analytics

// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);

// TODO: look into enabling offline data (https://firebase.google.com/docs/firestore/manage-data/enable-offline)
