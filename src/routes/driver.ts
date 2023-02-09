import { range } from './utils';
import { writable, derived } from "svelte/store";
import { Evaluator } from 'wasm-wordle';
// import { GameState } from 'wasm-wordle';

// The map of guessed chars for use in 
function generate_char_map():{key: string, value: string}[] {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const chars = {}
    for (let char of alphabet) {
        chars[char] = "empty"
    }
    // const map: Map<string, string> = new Map(Array.from(alphabet).map(c => [c,"empty"]));
    return chars;
}

let wordbank = {};

async function get_possible_answers(length: number) {
    const path = `/${length}_letter_answers.json`
    const words = await fetch(path).then(response => response.json());
    wordbank[length] = words;
    console.log("Fetched " + words.length + " " + length + " letter words");
}

async function generate_answer(length: number) {
    if (!(length in wordbank)) {
        await get_possible_answers(length);
    }
    const index = Math.floor(Math.random() * wordbank[length].length)
    return wordbank[length][index];
}

// binary search of the wordbank
function is_valid_guess(target: string):bool {
    const length = target.length;
    // assumes that wordbank has been populated
    let lo = 0, hi = wordbank[length].length;
    while (lo < hi) {
        let mid = (lo + hi) >> 1;
        let key = wordbank[length][mid];
        if (key === target) return true;
        else if (key > target) hi = mid;
        else lo = mid + 1;
    }
    return false;
}

export interface TileState {
    correctness: string;
    char: string;
}

export interface Row {
    [index: number]: TileState;
}

export interface Board {
    [index: number]: Row;
}

export class GameState {
    max_guesses: number = 6;
    current_guess: string = "";
    current = {row: 0, col: 0};
    answer: string;
    row_len: number;
    board: Board;
    chars;

    constructor(answer: string) {
        this.answer = answer;
        this.row_len = this.answer.length;
        this.chars = generate_char_map();

        let board = {};
        for (let i = 0; i < this.max_guesses; i++) {
            board[i] = {}
            for ( let j = 0; j  <this.row_len; j++) {
                board[i][j] = {correctness: "empty", char: ""}
            }
        }
        this.board = board
    }

    step_row() {
        this.current.row += 1;
        this.current.col = 0;
        this.current_guess = "";
    }

    at_end_of_row() {
        return this.row_len == this.current.col
    }

    evaluate():bool {
        // console.log(Evaluator);
        if (!is_valid_guess(this.current_guess)) return false;

        const correctness = Evaluator.evaluate(this.answer, this.current_guess)
        for (let i = 0; i < this.row_len; i++) {
            this.board[this.current.row][i].correctness = correctness[i];
            // NOTE: 
            // Desired functionality here is that characters are never
            // "downgraded" i.e. misplaced chars can be marked correct,
            // but not the other way around
            //
            // Misplaced chars will only ever be marked as misplaced or
            // correct so that relationship can be ignored.
            // That just leaves checking if it is already correct
            let char = this.current_guess[i];
            if (this.chars[char] !== "correct") {
                this.chars[char] = correctness[i];
            }
        }
        return true;
    }

    check() {
        // do nothing if the guess isn't complete
        if (this.at_end_of_row()) {
            const should_continue = this.evaluate();
            if (should_continue) this.step_row();
        }
    }

    send_char(ch: string): GameState {
        if (ch == "enter") {
            this.check()
        }
        else if (ch == "del") {
            const row = Math.max(0, this.current.row)
            const col = Math.max(0, this.current.col - 1)
            this.board[row][col].char = ""
            this.current.col = col;
            this.current_guess = this.current_guess.slice(0,-1);
        }
        else if (!this.at_end_of_row()) {
            this.current_guess += ch;
            this.board[this.current.row][this.current.col].char = ch
            this.current.col += 1;
        }
        return this
    }
}


async function create_game_state() {
    let answer = await generate_answer(5);
    console.log("Generated Answer:",answer);
    let game_state = new GameState(answer);
    return game_state;
}

async function create_game_store() {
    let game_state = await create_game_state();
    const { subscribe, set, update } = writable(game_state);

	return {
		subscribe,
        send_key: (chr) => {
            update(s => s.send_char(chr));
        },
		reset: async () => set(await create_game_state())
		// reset: () => set(0)
	};

}

export const game_state = await create_game_store();
