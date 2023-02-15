const { createRequire } = await import('node:module');
const require = createRequire(import.meta.url);
const { db } = await import('./src/lib/firebase/db.js');
const fs = await import('firebase/firestore');

function* chunks(arr) {
    const n = 500;
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

let wb = fs.collection(db,'wordbank');

function writeLen(len) {
    let wb_len = fs.collection(fs.doc(wb, '' + len),'words');
    const rand_id = () => fs.doc(wb_len).id;

    let words = require(`./src/lib/server/answers/${len}.json`);
    // const words = import(`./src/lib/server/answers/${len}.json`) assert {type: 'json'}
    console.log("creating batches for", words.length,"words of length",len);
    let batches = [];
    for (let chunk of chunks(words)) {
        let batch = fs.writeBatch(db);
        for (let i = 0; i < chunk.length; i++) {
            const word = chunk[i];
            const data = {
                rand: rand_id(),
                answer: true,
            }
            batch.set(fs.doc(wb_len, word), data);
        }
        batches.push(batch);
        console.log('saving',batch)
    }
    return batches;
}

const lengths = [
    4,
    // 5,
    6,
    7,
    8,
    9
];

async function writeAll() {
    for (let len of lengths) {
        let batches = writeLen(len);
        for (let batch of batches) {
            await batch.commit();
            console.log('saved batch... success:',batch._comitted,'mutations:',batch._mutations.length);
        }
    }
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
await getRand(words5);

console.log(await isValidGuess("crate", words5))
console.log(await isValidGuess("idontexist", words5))
