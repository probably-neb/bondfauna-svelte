import { json } from '@sveltejs/kit';

import AnswersFour from '$lib/server/answers/4.json';
import AnswersFive from '$lib/server/answers/5.json';
import AnswersSix from '$lib/server/answers/6.json';
import AnswersSeven from '$lib/server/answers/7.json';
import AnswersEight from '$lib/server/answers/8.json';
import AnswersNine from '$lib/server/answers/9.json';

import AllowedFour from '$lib/server/allowed/4.json';
import AllowedFive from '$lib/server/allowed/5.json';
import AllowedSix from '$lib/server/allowed/6.json';
import AllowedSeven from '$lib/server/allowed/7.json';
import AllowedEight from '$lib/server/allowed/8.json';
import AllowedNine from '$lib/server/allowed/9.json';

const answerbank = {
    4: AnswersFour,
    5: AnswersFive,
    6: AnswersSix,
    7: AnswersSeven,
    8: AnswersEight,
    9: AnswersNine,
}

const wordbank = {
    4: AllowedFour,
    5: AllowedFive,
    6: AllowedSix,
    7: AllowedSeven,
    8: AllowedEight,
    9: AllowedNine,
}
const DEFAULT_LEN = '5';


/* @type {import('@sveltejs/kit').RequestHandler}} */
export function GET( {url} ) {
    const word_len = Number(url.searchParams.get('length') ?? '5');
    const num_words = answerbank[word_len].length;
    const word = answerbank[word_len][Math.floor(Math.random() * num_words)];

    return new Response(word);
}

function binSearch(target) {
	const length = target.length;
	let lo = 0,
		hi = wordbank[length].length;
	while (lo < hi) {
		let mid = (lo + hi) >> 1;
		let key = wordbank[length][mid];
		if (key === target) return true;
		else if (key > target) hi = mid;
		else lo = mid + 1;
	}
	return false;
}

/* @type {import('@sveltejs/kit').RequestHandler}} */
export async function POST( { request } ) {
    const guess = await request.text();
    console.log("guess:",guess);
    return json(binSearch(guess));
}
