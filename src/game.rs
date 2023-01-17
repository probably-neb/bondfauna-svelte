use std::{iter::zip, rc::Rc};

use crate::letters::Chr;
use roget::Correctness;
use yew::prelude::*;

#[derive(Default, Clone, Copy, PartialEq)]
struct TileState {
    current: Option<Chr>,
    goodness: Option<Correctness>,
}

#[derive(Properties, PartialEq, Eq)]
pub struct TileProps {
    col: usize,
    row: usize,
}

#[function_component]
pub fn Tile(props: &TileProps) -> Html {
    let state = use_state_eq(TileState::default);
    let ctx = use_context::<GameContext>().unwrap();
    state.set(ctx.board_state[props.row][props.col]);
    // let pos = format!("{},{}", props.col, props.row);
    let disp = state.current.map(|c| c.to_char()).unwrap_or(' ');
    // let disp = "_";
    let data_guess = if let Some(correctness) = state.goodness {
        format!("{:?}", correctness)
    } else {
        String::new()
    };
    html!(
        <div class="tile" data-guess={data_guess}>{disp}</div>
    )
}

#[derive(Properties, PartialEq, Eq)]
pub struct RowProps {
    row: usize,
}

#[function_component]
pub fn Row(props: &RowProps) -> Html {
    // let row_height = (10.0 / 6.0) as u32;
    let row = props.row;
    let boxes = (0..5).map(|col| html! { <Tile {row} {col} /> });
    html!(
        <div class="row">{boxes.collect::<Html>()}</div>
    )
}

#[function_component]
pub fn Board() -> Html {
    let rows = (0..6).map(|row| html! { <Row {row}/> });
    html!(
        <div class="board-outer">
            <div class="board-inner" style="width: 60%; height: 60%;">
                {rows.collect::<Html>()}
            </div>
        </div>
    )
}

type BoardState = [[TileState; 5]; 6];

// TODO: Move gamestate to it's own module
#[derive(Default, Copy, Clone, PartialEq)]
struct GameState {
    board_state: BoardState,
    cur_pos: (usize, usize),
    answer: &'static str,
}

impl GameState {
    fn update_cur_pos(&mut self, c: Option<Chr>) {
        self.board_state[self.cur_pos.1][self.cur_pos.0].current = c;
    }
    fn current_row(&self) -> &[TileState; 5] {
        &self.board_state[self.cur_pos.1]
    }
    fn current_row_mut(&mut self) -> &mut [TileState; 5] {
        &mut self.board_state[self.cur_pos.1]
    }
    fn evaluate_guess(&self) -> [Correctness; 5] {
        let guess_chars = self
            .current_row()
            .map(|state| state.current.expect("Guess has Chr").to_char());
        let guess = String::from_iter(guess_chars);
        let correctness = Correctness::compute(self.answer, &guess);
        log::info!("Computed Correctness: {:?}", correctness);
        correctness
    }
    fn update_tile_states_from_guess(&mut self, guess: [Correctness; 5]) {
        for (correctness, mut tile_state) in zip(guess, self.current_row_mut()) {
            tile_state.goodness = Some(correctness);
        }
    }

    fn puts(mut self, c: Chr) -> Self {
        if self.cur_pos.1 == 6 {
            return self;
        }
        match c {
            Chr::ENTER => {
                if self.cur_pos.0 == 5 {
                    self.update_tile_states_from_guess(self.evaluate_guess());
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

    fn new(answer: &'static str) -> Self {
        Self {
            answer,
            ..Default::default()
        }
    }
}

impl Reducible for GameState {
    type Action = Chr;

    fn reduce(self: Rc<Self>, action: Self::Action) -> Rc<Self> {
        // NOTE: This __copies__ out of RC. Will need to clone, do unsafe,
        // or rethink strategy if GameState can no longer be Copy
        self.puts(action).into()
    }
}

type GameContext = UseReducerHandle<GameState>;

#[function_component]
pub fn GameInterface() -> Html {
    // NOTE: use_memo takes dependencies:
    // set dependency on game number to calculate
    // a new a answer
    let answer = use_memo(
        |_step| {
            let answer = crate::driver::generate_answer();
            log::info!("Created Answer: {}", answer);
            answer
        },
        (),
    );

    let board_state = use_reducer_eq({ move || GameState::new(&answer) });

    let onclick = Callback::from({
        let board_state = board_state.clone();
        move |code| {
            // log::info!("pressed key: {}", code);
            board_state.dispatch(code);
        }
    });

    html! {
        <div class="game">
            <ContextProvider<GameContext> context={board_state}>
                <Board />
                <crate::key::Keyboard {onclick}/>
            </ContextProvider<GameContext>>
        </div>
    }
}
