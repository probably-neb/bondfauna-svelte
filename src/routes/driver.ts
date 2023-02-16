import { range } from './utils';
import { writable, derived } from 'svelte/store';
import type { Store } from 'svelte/store';
import { assets } from "$app/paths";
import { browser  } from '$app/environment';
import { generate_answer, is_valid_guess } from '$lib/firebase/api';

export const Correctness = Object.freeze({
/**
* Green
*/
// correct:3,3:"correct",
correct:"correct",
/**
* Yellow
*/
// misplaced:2,2:"misplaced",
misplaced:"misplaced",
/**
* Gray
*/
// wrong:1,1:"wrong", 
wrong:"wrong", 
});

export function defaultCorrectness() {
	return 'empty';
}

// The map of guessed chars for use in
function generate_char_map(): { key: string; value: string }[] {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const chars = {};
	for (let char of alphabet) {
		chars[char] = defaultCorrectness();
	}
	return chars;
}

function compute_correctness(answer: string, guess: string ):bool {
    let misplaced = {}
    // assumes answer and guess are the same length
    const length = guess.length;

    let correctness = Array(length).fill(Correctness.wrong);
    for (let i = 0; i < length; i++) {
        if (answer[i] === guess[i]) {
            correctness[i] = Correctness.correct;
        } else {
            const count = misplaced[answer[i]] ?? 0;
            misplaced[answer[i]] = count + 1;
        }
    }

    for (let i = 0; i < length; i++) {
        const times_misplaced = misplaced[guess[i]] ?? 0;
        if (correctness[i] === Correctness.wrong && times_misplaced > 0) {
            correctness[i] = Correctness.misplaced;
            misplaced[guess[i]] = times_misplaced - 1;
        }
    }

    return correctness;
}

export interface TileState {
	correctness: string;
	char: string;
}

export function defaultTileState() {
	return { correctness: defaultCorrectness(), char: ' ' };
}

export interface Row {
	[index: number]: TileState;
}

export interface Board {
	[index: number]: Row;
}

export class GameState {
	max_guesses: number = 6;
	current_guess: string = '';
	current = { row: 0, col: 0 };
	done: bool = false;
	answer: string;
	row_len: number;
	board: Board;
	chars;
    guessed = {just_did: false,valid: false,guess:""};

	constructor(answer: string) {
		this.answer = answer;
		this.row_len = this.answer.length;
		this.chars = generate_char_map();

		let board = Array(this.max_guesses);
		for (let i = 0; i < this.max_guesses; i++) {
			board[i] = Array(this.row_len);
			for (let j = 0; j < this.row_len; j++) {
				board[i][j] = defaultTileState();
			}
		}
		this.board = board;
	}

    word_at_row(row: number):string {
        return this.board[row].map((tile) => tile.char).join('');
    }

	step_row() {
		this.current.row += 1;
		this.current.col = 0;
		this.current_guess = '';
	}

	at_end_of_row() {
		return this.row_len == this.current.col;
	}

	async evaluate(): bool {
		// console.log(Evaluator);
        const guess = this.current_guess;
        const valid = await is_valid_guess(guess);
        console.log("guess:",`"${guess}"`,"valid:",valid);

        this.guessed = {guess,valid,just_did:true};

		if (!valid) return false;

		const correctness = compute_correctness(this.answer, this.current_guess);
		let all_correct = true;
		for (let i = 0; i < this.row_len; i++) {
			let c = correctness[i];
			this.board[this.current.row][i].correctness = c;
			// NOTE:
			// Desired functionality here is that characters are never
			// "downgraded" i.e. misplaced chars can be marked correct,
			// but not the other way around
			//
			// Misplaced chars will only ever be marked as misplaced or
			// correct so that relationship can be ignored.
			// That just leaves checking if it is already correct
			let char = this.current_guess[i];
			if (this.chars[char] !== 'correct') {
				this.chars[char] = c;
			}

			all_correct = all_correct && c === 'correct';
		}
		this.done = all_correct;

		return !all_correct;
	}

	async check() {
		// do nothing if the guess isn't complete
		if (this.at_end_of_row()) {
			const on_last_guess = this.current.row == this.max_guesses - 1;
			const valid_but_not_correct_guess = await this.evaluate();
			const should_continue = valid_but_not_correct_guess && !on_last_guess;
			if (should_continue) this.step_row();
		}
	}

	async send_char(ch: string): GameState {
		if (ch == 'enter') {
			await this.check();
		} else if (ch == 'backspace' && !this.done) {
            this.guessed.just_did = false;
			const row = Math.max(0, this.current.row);
			const col = Math.max(0, this.current.col - 1);
			this.board[row][col].char = ' ';
			this.current.col = col;
			this.current_guess = this.current_guess.slice(0, -1);
		} else if (!this.at_end_of_row()) {
            if (this.current.col == 0) {
                this.guessed.just_did = false;
            }
			this.current_guess += ch;
			this.board[this.current.row][this.current.col].char = ch;
			this.current.col += 1;
		}
		return this;
	}
}

async function create_game_state(length) {
	let answer = await generate_answer(length);
	console.log('Generated Answer:', answer);
	let game_state = new GameState(answer);
	return game_state;
}

async function create_game_store() {
	let game_state = await create_game_state(5);

	const { subscribe, set, update } = writable(game_state);

	async function reset(length) {
		if (!length) {
			// this is definitely a hack
			update((gs) => {
				length = gs.row_len;
				return gs;
			});
		}

		let new_gamestate = await create_game_state(length);
        game_state = new_gamestate;
		set(game_state);
	}

	// IDEA: can gamestate subscribe to writeable(difficulty) so difficulty
	// can be cause update to gamestate
	// easiest impl is to extract the subscribe write from writeable(diff)
	// and wrap set so it updates gamestate before calling original set
	//
	// could also have it update board size store

	return {
		subscribe,
		send_key: async (chr) => {
            // update uses set behind the scenes anyway
            // as far as I can tell so this is an easy
            // way to update the game state with async

            await game_state.send_char(chr);
            set(game_state);
		},
		change_difficulty: async (diff) => {
			console.log('Changing difficulty to', diff);
			await reset(diff);
		},
		reset
		// reset: () => set(0)
	};
}

export const game_state = await create_game_store();
export const char_states: Store<{ key: string; value: string }[]> = derived(
	game_state,
	($game_state) => $game_state.chars
);
export const difficulty: Store<number> = derived(game_state, ($game_state) => $game_state.row_len);
export const board: Store<Board> = derived(game_state, ($game_state) => $game_state.board);
export const board_size: Store<{ rows: number; cols: number }> = derived(
	game_state,
	($game_state) => ({ rows: $game_state.max_guesses, cols: $game_state.row_len })
);
