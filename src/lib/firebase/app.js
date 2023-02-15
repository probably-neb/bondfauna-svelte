// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// FIXME: make this static/private so it is server side

import { FIREBASE_CONFIG_BASE64 } from '$env/static/public';
const firebaseConfig = JSON.parse(atob(FIREBASE_CONFIG_BASE64));

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// TODO: look into enabling analytics
// import { getAnalytics } from "firebase/analytics";
//
// const analytics = getAnalytics(app);

// TODO: look into enabling offline data (https://firebase.google.com/docs/firestore/manage-data/enable-offline)
