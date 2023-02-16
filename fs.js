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


function* chunks(arr) {
    const n = 500;
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

let wb = fs.collection(db,'wordbank');

function getWriteBatches(len, type) {
    let wb_len = fs.collection(fs.doc(wb, '' + len),'words');
    const rand_id = () => fs.doc(wb_len).id;

    let words = require(`./src/lib/server/${type}/${len}.json`);
    // const words = import(`./src/lib/server/answers/${len}.json`) assert {type: 'json'}
    console.log("creating batches for", words.length,"words of length",len);
    let batches = [];
    const answer = type === "answers";
    for (let chunk of chunks(words)) {
        let batch = fs.writeBatch(db);
        for (let i = 0; i < chunk.length; i++) {
            const word = chunk[i];
            const data = {
                rand: rand_id(),
            }
            // do not set answer to false, because it will overwrite 
            // the answers when updating the allowed
            if (answer) data.answer = true;
            batch.update(fs.doc(wb_len, word), data);
        }
        batches.push(batch);
        // console.log('saving',batch)
    }
    return batches;
}


const rand_id = (col) => fs.doc(col).id;
const words5 = fs.collection(db,'wordbank','5','words');

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

async function writeAll(lengths, type) {
    for (let len of lengths) {
        let batches = getWriteBatches(len, type);
        for (let batch of batches) {
            let success = true;
            await batch.commit().catch(e => {success = e;});;
            console.log('saved batch of',len,'words... success:', success,'mutations:',batch._mutations.length);
        }
    }
}

const MODE = "allowed";
// NOTE: to specify path can change this to map
// and use for(const [k,v] of LENGTHS)
const LENGTHS = [
    // 4,
    5,
    // 6,
    // 7,
    // 8,
    // 9
];

await writeAll(LENGTHS, MODE);
console.log('done!');
