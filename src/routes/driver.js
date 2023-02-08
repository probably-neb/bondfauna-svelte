import { range } from './utils';
import { writable } from "svelte/store";
import { GameState } from 'wasm-wordle';

// The map of guessed chars for use in 
// const alphabet = "abcdefghijklmnopqrstuvwxyz";
// let map = new Map(Array.from(alphabet).map(c => [c,false]));
// export const = chars = writeable(map);

function create_game_state() {
    const gs = new GameState();
    console.log(gs);
    // console.log(GameState.test());
    const { subscribe, set, update } = writable(new GameState());
    // const { subscribe, set, update } = writable(0);
    // const { subscribe, set, update } = writable(0);
    // console.log(GameState);

	return {
		subscribe,
        send_key: (chr) => {
            console.log("Sent:",chr);
            update(s => s.send_char(chr));
        },
		// reset: () => set(new GameState())
		// reset: () => set(0)
	};
}

export const game_state = create_game_state();
