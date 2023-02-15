import { getFirestore } from "firebase/firestore";
import { app } from './app.js';
import { doc, getDocs, getDoc, where, query, collection, limit } from "firebase/firestore";
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function wbOfLength(len) {
    const strLen = '' + len;
    return collection(db, 'wordbank', strLen, 'words');
}

function randomId(col) {
    return doc(col).id;
}

// https://stackoverflow.com/a/46801925
async function getRand(col) {
    let rand = randomId(col);
    const q = query(col, where("answer",'==',true),where("rand",">=",rand), limit(1))
    let resp = await getDocs(q);
    // FIXME: just retry on empty
    if (resp.empty) {
        return null;
    }
    else {
        return resp.docs[0].id;
    }
}

export async function getRandomAnswer(len) {
    let col = wbOfLength(len);
    return await getRand(col);
}

export async function isValidGuess(guess) {
    const len = guess.length;
    const col = wbOfLength(len);
    const dref = doc(col, guess);
    const d = await getDoc(dref);
    return d.exists();
}

export async function report(guess, action) {
    const strLen = '' + guess.length;
    const col = collection(db, 'wordbank', strLen, 'updates');
    // await setDoc(doc(col), {
    // let dref = doc(col, guess);
}
