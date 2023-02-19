import { json } from '@sveltejs/kit';
import { getRandomAnswer, isValidGuess } from '$lib/firebase/db';

const DEFAULT_LEN = '5';

/* @type {import('@sveltejs/kit').RequestHandler}} */
export async function GET({ url }) {
	const word_len = Number(url.searchParams.get('length') ?? DEFAULT_LEN);
	const word = await getRandomAnswer(word_len);
	return new Response(word);
}

// TODO: merge post with get request and make post accept
// new words to add to the database

/* @type {import('@sveltejs/kit').RequestHandler}} */
export async function POST({ request }) {
	const guess = await request.text();
	const valid = await isValidGuess(guess);
	console.log({ guess, valid });
	// TODO: consider returning new Response here
	// as long as it does not stringify the response
	return json(valid);
}
