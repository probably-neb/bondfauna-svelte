import { json } from '@sveltejs/kit';
import { APPENDABOT_BASE64, GOOGLE_SHEET_ID } from '$env/static/private'
import * as spreadsheets from '@googleapis/sheets';

// configure this endpoint as a vercel serverless function
/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
    runtime: 'nodejs18.x'
};

const appendabot = atob(APPENDABOT_BASE64);
console.log(appendabot);
const appendabot_json = JSON.parse(appendabot);
console.log(appendabot_json);
// const auth = new spreadsheets.auth.(appendabot_json);
const auth = new spreadsheets.auth.GoogleAuth({
    credentials: appendabot_json,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
console.log(auth);

const sheets = spreadsheets.sheets({version: 'v4', auth});

/* @type {import('@sveltejs/kit').RequestHandler}} */
export async function POST( { request } ) {
    const { word, action } = await request.json();

    // console.log(word,action);
    const page = `${action}${word.length}`
    const range = `${page}!A:A`;
    console.log({range})

    const res = await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: {values: [[word]]},
    })
    console.log(res.data);

    return json(res.data);
}
