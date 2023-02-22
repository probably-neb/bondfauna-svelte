import { json } from '@sveltejs/kit';
import { requestUpdate } from '$lib/firebase/db';

/* @type {import('@sveltejs/kit').RequestHandler}} */
export async function POST({ request, getClientAddress }) {
    const address = getClientAddress();
	const { word, action } = await request.json();
	console.log('server asked to', action, word);
	await requestUpdate(word, action, address);
	return new Response('ok');
}
