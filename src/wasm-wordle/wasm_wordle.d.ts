/* tslint:disable */
/* eslint-disable */
/**
* @returns {string}
*/
export function test(): string;
/**
*/
export enum Correctness {
/**
* Green
*/
  Correct,
/**
* Yellow
*/
  Misplaced,
/**
* Gray
*/
  Wrong,
}
/**
*/
export class Evaluator {
  free(): void;
/**
* @param {string} answer
* @param {string} guess
* @returns {any[]}
*/
  static evaluate(answer: string, guess: string): any[];
}
/**
*/
export class GameState {
  free(): void;
/**
* @param {string} chr
* @returns {GameState}
*/
  send_key(chr: string): GameState;
/**
* @returns {string}
*/
  static test(): string;
/**
*/
  constructor();
/**
* @returns {GameState}
*/
  reset(): GameState;
/**
*/
  readonly board_state: any;
/**
*/
  readonly chars: any;
}
/**
*/
export class TileState {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_tilestate_free: (a: number) => void;
  readonly __wbg_gamestate_free: (a: number) => void;
  readonly gamestate_chars: (a: number, b: number) => void;
  readonly gamestate_board_state: (a: number, b: number) => void;
  readonly gamestate_send_key: (a: number, b: number, c: number) => number;
  readonly gamestate_test: (a: number) => void;
  readonly gamestate_new: () => number;
  readonly gamestate_reset: (a: number) => number;
  readonly test: (a: number) => void;
  readonly evaluator_evaluate: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_evaluator_free: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
