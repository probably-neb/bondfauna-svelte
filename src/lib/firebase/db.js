import { getFirestore } from 'firebase/firestore';
import { app } from './app.js';
import { IPGEO_API_KEY } from '$env/static/private';
import { doc, getDocs, getDoc, setDoc, where, query, collection, limit } from 'firebase/firestore';
import { dev } from '$app/environment';
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

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
	const q = query(col, where('answer', '==', true), where('rand', '>=', rand), limit(1));
	let resp = await getDocs(q);
	// FIXME: just retry on empty
	if (resp.empty) {
		return null;
	} else {
		return resp.docs[0].id;
	}
}

export async function getRandomAnswer(len) {
	let col = wbOfLength(len);
	const answer = await getRand(col);
	console.log('recieved random answer:', answer);
	// FIXME: return err and check for error on callee side
	// to avoid 18 letter words when the error message is
	// interpreted as the answer
	return answer;
}

export async function isValidGuess(guess) {
	const len = guess.length;
	const col = wbOfLength(len);
	const dref = doc(col, guess);
	const d = await getDoc(dref);
	return d.exists();
}

async function getIpLocation(ip) {
    return await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEO_API_KEY}&ip=${ip}`).then(r=>r.json())
}

export async function requestUpdate(word, action, address) {
	// TODO: store action in cookies
	// and allow user to guess words in
	// their cookies even if they're not
	// in the db yet
    const loc = await getIpLocation(address);
	const strLen = '' + word.length;
	// the record of this update
	const record = collection(db, 'wordbank', strLen, 'updates');
	const recordId = `${action}: ${word}`;
	const recordData = {
		word,
		action,
		timestamp: new Date(),
        location: loc,
	};
	// TODO: consider doing an update here
	// and incrementing a counter
	// also getting geographical information from ip?
	// just because it would be interesting to see where
	// people were reporting words

	const recordTransaction = setDoc(doc(record, recordId), recordData);

	// the actual update (actually adds this word to the database)
	const update = collection(db, 'wordbank', strLen, 'words');
	const updateData = {
		answer: false,
		rand: randomId(update)
	};
	const updateTransaction = setDoc(doc(update, word), updateData);

    if (!dev) {
        await Promise.all([recordTransaction, updateTransaction]);
    } else {
        console.log('requestUpdate', {recordData,updateData});
    }
}
