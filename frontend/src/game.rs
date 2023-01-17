use std::rc::Rc;

use yew::prelude::*;

use crate::letters::Chr;

#[derive(Default, Copy, Clone, PartialEq)]
enum Goodness {
    Correct,
    #[default]
    Unknown,
    Misplaced,
}

#[derive(Default, Clone, Copy, PartialEq)]
struct TileState {
    current: Option<Chr>,
    goodness: Goodness,
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
    html!(
        <div class="tile">{disp}</div>
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

#[derive(Default, Clone, Copy, PartialEq)]
struct GameState {
    board_state: BoardState,
    cur_pos: (usize, usize),
}

impl GameState {
    fn update_cur_pos(&mut self, c: Option<Chr>) {
        self.board_state[self.cur_pos.1][self.cur_pos.0].current = c;
    }
    fn puts(mut self, c: Chr) -> Self {
        if self.cur_pos.1 == 6 {
            return self;
        }
        match c {
            Chr::ENTER => {
                if self.cur_pos.0 == 5 {
                    self.cur_pos.0 = 0;
                    self.cur_pos.1 += 1;
                }
            },
            Chr::DEL => {
                if self.cur_pos.0 != 0 {
                    self.cur_pos.0 -= 1;
                    self.update_cur_pos(None);
                }
            }

            _ => {
                if self.cur_pos.0 != 5 {
                    let prev = self.cur_pos;
                    self.update_cur_pos(Some(c));
                    self.cur_pos.0 += 1;
                    log::info!("puts: {:?} -> {:?}", prev, self.cur_pos);
                }
            }
        }
        return self;
    }
}

impl Reducible for GameState {
    type Action = Chr;

    fn reduce(self: Rc<Self>, action: Self::Action) -> Rc<Self> {
        return Rc::new(self.puts(action));
    }
}

type GameContext = UseReducerHandle<GameState>;

#[function_component]
pub fn Game() -> Html {
    let board_state = use_reducer_eq(GameState::default);

    let onclick = Callback::from({
        let board_state = board_state.clone();
        move |code| {
            log::info!("pressed key: {}", code);
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
