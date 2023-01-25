import { writeable } from "svelte/store";
import { range } from './utils';
import { Evaluator } from "roget";

// The map of guessed chars for use in 
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let map = new Map(Array.from(alphabet).map(c => [c,false]));
export const = chars = writeable(map);
