import { browser } from '$app/environment';

export async function generate_answer(length) {
    if (browser) {
    const answer =  await fetch(`/api/wordbank?length=${length}`,{
        method: 'GET',
    }).then(r => r.text());

        // TODO: check for errors
        return answer;
    }
        // fixme: return failure and check for failure in callers
        // instead of giving dummy data
        return 'wait!';
}

export async function is_valid_guess(guess) {
    if (browser) {
    const valid = await fetch('/api/wordbank',{
        method: 'POST',
        body: guess,
    }).then(r => r.json());
        // TODO: check for errors
        return valid;
    }
    // fixme: return failure and check for failure in callers
    // instead of giving dummy data
    return false;
}

export async function request_update(word, action) {
    console.log('asking server to', action, word,action === 'add' ? 'to' : 'from','wordbank');
    await fetch('/api/wordbank/report',{
        method: 'POST',
        body: JSON.stringify({word, action}),
        headers: {
    "content-type": 'application/json',
        }
    });
}
