import { json } from '@sveltejs/kit';
import { requestUpdate } from '$lib/firebase/db';

/* @type {import('@sveltejs/kit').RequestHandler}} */
export async function POST({ request }) {
	const { word, action } = await request.json();
	console.log('server asked to', action, word);
	await requestUpdate(word, action);
	return new Response('ok');
}
