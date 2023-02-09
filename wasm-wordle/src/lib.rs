use rand::prelude::*;
use std::iter::zip;
// use roget::*;
pub use roget::{Correctness, Evaluator};
use serde::Serialize;
use wasm_bindgen::prelude::*;

mod letters;
use letters::Chr;

type Entry<T> = Vec<T>;
type EntryRef<'a, T> = &'a [T];

const LINES_IN_ANSWERS_FILE: usize = 2309;
const ANSWERS: &str = include_str!("../possible_answers.txt");

// First up let's take a look of binding `console.log` manually, without the
// help of `web_sys`. Here we're writing the `#[wasm_bindgen]` annotations
// manually ourselves, and the correctness of our program relies on the
// correctness of these annotations!

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

// Next let's define a macro that's like `println!`, only it works for
// `console.log`. Note that `println!` doesn't actually work on the wasm target
// because the standard library currently just eats all output. To get
// `println!`-like behavior in your app you'll likely want a macro like this.

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub fn generate_answer() -> &'static str {
    let mut rng = thread_rng();
    let line = rng.gen_range(0..LINES_IN_ANSWERS_FILE);
    let answer = ANSWERS.lines().nth(line).unwrap();
    answer
}

#[wasm_bindgen]
pub fn test() -> String {
    return "foo".to_string();
}

#[wasm_bindgen]
#[derive(Default, Clone, PartialEq, Eq, Serialize)]
pub struct TileState {
    current: Option<char>,
    goodness: Option<Correctness>,
}

pub type BoardState = Vec<Vec<TileState>>;

#[wasm_bindgen]
#[derive(Default, Clone, PartialEq)]
pub struct GameState {
    board_state: BoardState,
    cur_pos: (usize, usize),
    size: (usize, usize),
    answer: &'static str,
    chars: [Option<Correctness>; 30],
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(getter)]
    pub fn chars(&self) -> Result<JsValue, JsValue> {
        Ok(serde_wasm_bindgen::to_value(&self.chars)?)
    }
    #[wasm_bindgen(getter)]
    pub fn board_state(&self) -> Result<JsValue, JsValue> {
        Ok(serde_wasm_bindgen::to_value(&self.board_state)?)
    }
    fn update_cur_pos(&mut self, c: Option<Chr>) {
        self.board_state[self.cur_pos.1][self.cur_pos.0].current = c.map(|c| c.to_char());
    }
    fn current_row(&self) -> &[TileState] {
        &self.board_state[self.cur_pos.1]
    }
    fn current_row_mut(&mut self) -> &mut [TileState] {
        &mut self.board_state[self.cur_pos.1]
    }

    fn current_guess(&self) -> Vec<char> {
            self.current_row()
                .iter()
                .map(|state| state.current.expect("Guess has Chr"))
            .collect()
    }

    fn update_chars(&mut self, guess_chars: EntryRef<char>, correctness: EntryRef<Correctness>) {
        for (ch, goodness) in zip(guess_chars, correctness) {
            self.chars[Chr::from_char(ch).to_usize()].replace(*goodness);
        }
    }

    fn evaluate_guess(&self) -> (Entry<char>, Entry<Correctness>) {
        let guess_chars = self.current_guess();
        let guess = String::from_iter(guess_chars.iter());
        let correctness = Evaluator::compute(self.answer, &guess);

        log::info!("Computed Correctness: {:?}", correctness);
        (guess_chars, correctness)
    }

    fn update_tile_states_from_guess(&mut self, guess: EntryRef<Correctness>) {
        for (correctness, tile_state) in zip(guess, self.current_row_mut()) {
            tile_state.goodness.replace(*correctness);
        }
    }

    fn puts(mut self, c: Chr) -> Self {
        log::info!("Putting Char: {c:?}");
        if self.cur_pos.1 == 6 {
            return self;
        }
        match c {
            Chr::ENTER => {
                if self.cur_pos.0 == 5 {
                    let (guess_chars, correctness) = self.evaluate_guess();

                    self.update_chars(&guess_chars, &correctness);
                    self.update_tile_states_from_guess(&correctness);

                    self.cur_pos.0 = 0;
                    self.cur_pos.1 += 1;
                }
            }
            Chr::DEL => {
                if self.cur_pos.0 != 0 {
                    self.cur_pos.0 -= 1;
                    self.update_cur_pos(None);
                }
            }

            _ => {
                if self.cur_pos.0 != 5 {
                    // let prev = self.cur_pos;
                    self.update_cur_pos(Some(c));
                    self.cur_pos.0 += 1;
                    // log::info!("puts: {:?} -> {:?}", prev, self.cur_pos);
                }
            }
        }
        return self;
    }

    #[wasm_bindgen]
    pub fn send_key(self, chr: String) -> Self {
        log::info!("Recieved Chr: {chr}");
        self.puts(Chr::from_str(&chr))
    }

    fn new_with_answer(answer: &'static str) -> Self {
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
        console_log::init_with_level(log::Level::Trace).expect("error initializing logger");

        log::error!("Created Answer: {}", answer);
        console_log!("Created Answer: {}", answer);
        panic!("test panic");
        Self {
            answer,
            ..Default::default()
        }
    }

    pub fn test() -> String {
        return String::from("foo");
    }

    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let answer = generate_answer();
        Self::new_with_answer(answer)
    }

    pub fn reset(self) -> Self {
        Self::new()
    }
}
