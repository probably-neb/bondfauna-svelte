const { createRequire } = await import('node:module');
const require = createRequire(import.meta.url);

import { loadEnv } from 'vite';
import dotenv from 'dotenv';
dotenv.config();
// console.log(process.cwd());
// const env = loadEnv(process.cwd());
// console.log({env})
import { initializeApp } from "firebase/app";
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);

import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);

const fs = await import('firebase/firestore');

const LENGTHS = [
    4,
    5,
    6,
    7,
    8,
    9
];

const rand_id = (col) => fs.doc(col).id;

async function getRand(col) {
    let rand = rand_id(col);
    const q = fs.query(col, fs.where("answer",'==',true),fs.where("rand",">=",rand), fs.limit(1))
    // fs.getDocs(q).then((words) => words.forEach( w => console.log(w.id,'=>',w.data())));
    fs.getDocs(q).then(w => w.docs[0].id).then(console.log);
}

async function isValidGuess(guess, col) {
    let len = guess.length;
    let dref = fs.doc(col, guess);
    let d = await fs.getDoc(dref)
    return d.exists();
}


function* chunks(arr) {
    const n = 500;
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}



function getWriteBatches(len, type, words) {
    let wb = fs.collection(db,'wordbank');
    let wb_len = fs.collection(fs.doc(wb, '' + len),'words');

    console.log("generating batches for",words.length,"words of length", +len)
    // const words = import(`./src/lib/server/answers/${len}.json`) assert {type: 'json'}
    let batches = [];
    const answer = type === "answers";
    for (let chunk of chunks(words)) {
        let batch = fs.writeBatch(db);
        for (let i = 0; i < chunk.length; i++) {
            const word = chunk[i];
            const data = {
                rand: rand_id(wb_len),
                answer,
            }
            // do not set answer to false, because it will overwrite 
            // the answers when updating the allowed
            // if (answer) data.answer = true;
            batch.set(fs.doc(wb_len, word), data);
        }
        batches.push(batch);
        // console.log('saving',batch)
    }
    return batches;
}


async function writeAll(len, type, words) {
    let batches = getWriteBatches(len, type, words);
    for (let batch of batches) {
        let success = true;
        await batch.commit().catch(e => {success = e;});;
        console.log('saved batch of',batch._mutations.length,'words... success:', success);
    }
}

function readDayChunk(day) {
    const path = `./data/chunks/${day}.json`;
    const data = require(path);
    const [length,words] = Object.entries(data)[0];
    return [length,words];
}

async function* getFiles(dir) {
    const { resolve } = require('path');
    const { readdir } = require('fs').promises;

    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}
async function getChunkWordCounts() {
    for await (const path of getFiles('./data/chunks/')) {
        const chunk = path.split("/").pop()
        const day = chunk.split(".")[0];
        const [length,words] = readDayChunk(+day)
        console.log(words.length,"words of length",+length, "in chunk",+day)
    }
}

async function getFirestoreAnswerCounts() {
    for (const len of LENGTHS) {
        let wb = fs.collection(db,'wordbank');
        let wb_len = fs.collection(fs.doc(wb, '' + len),'words');
        let q = fs.query(wb_len,fs.where('answer','==',true));
        const snap = await fs.getCountFromServer(q);
        console.log("there are",snap.data().count,len,"letter answers")
    }
}
async function getFirestoreWordCounts() {
    for (const len of LENGTHS) {
        let wb = fs.collection(db,'wordbank');
        let wb_len = fs.collection(fs.doc(wb, '' + len),'words');
        const snap = await fs.getCountFromServer(wb_len);
        console.log("there are",snap.data().count,len,"letter words")
    }
}

async function writeAllFromChunk(chunk, mode) {
    const [length,words] = readDayChunk(chunk);
    await writeAll(length, mode, words);
}

// const MODE = "allowed";
// const DAY = 7

const args = process.argv.slice(2);
if (args[0] === "answers") {
    await getFirestoreAnswerCounts()
}
else if (args[0] === "words") {
    await getFirestoreWordCounts()
}
else if (args[0] === "chunks") {
    await getChunkWordCounts()
}
else if (args[0] === "write") {
    const day = +args[1];
    const mode = args.length > 2 ? args[2] : "allowed";
    await writeAllFromChunk(day, mode);
    console.log("you should delete chunk:",day,"now");
}
console.log('done!');

// TODO: when creating script to get all requested additions and do them
// make sure to add an 'added: when' field
