use std::{iter::zip, rc::Rc};
use wasm_bindgen::{JsCast, UnwrapThrowExt};

use crate::{driver, letters::Chr};
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

pub fn correctness_to_string(state: Option<Correctness>) -> String {
    if let Some(correctness) = state {
        format!("{:?}", correctness)
    } else {
        "empty".to_string()
    }
}

#[function_component]
pub fn Tile(props: &TileProps) -> Html {
    let state = use_state_eq(TileState::default);
    let ctx = use_context::<GameContext>().unwrap();
    state.set(ctx.board_state[props.row][props.col]);
    // let pos = format!("{},{}", props.col, props.row);
    let disp = state.current.map(|c| c.to_char()).unwrap_or(' ');
    // let disp = "_";
    let data_guess = correctness_to_string(state.goodness);
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

// #[derive(Properties, PartialEq)]
// pub struct InnerBoardProps {
//     parent_size: (u32,u32)
// }

#[function_component]
pub fn InnerBoard(/* props: &InnerBoardProps */) -> Html {
    let rows = (0..6).map(|row| html! { <Row {row}/> });
    let div_ref = use_node_ref();
    let get_updated_dimensions = {
        let div_ref = div_ref.clone();
        move || -> (i32, i32) {
            // r = (n = Math.floor(e.clientHeight * (5 / 6)), i = t, Math.min(Math.max(n, i), 350));
            //             var n,
            //             i;
            // const l = 6 * Math.floor(r / 5);

            let h: Option<i32> = div_ref
                .get()
                .and_then(|this| this.parent_element())
                .map(|parent| parent.client_height());

            // log::info!("height {:?}", h);
            let h: i32 = match h {
                Some(h) => h,
                None => return (300, 360),
            };
            let n: i32 = (h as f32 * (5. / 6.)).floor() as i32;
            // let i = 0;
            let i = 300;
            // can make this return some and use ? instead of unwrap above
            let r = i32::min(i32::max(n, i), 350);
            let l = 6 * (r as f32 / 5.).floor() as i32;
            log::info!("resized: r: {r} l: {l} n: {n} i: {i} h: {h}");
            (r, l)
        }
    };

    let dimensions = use_state(get_updated_dimensions.clone());

    // let parent_size = use_memo(
    let resize = Callback::from({
        let dimensions = dimensions.clone();
        move |(x, y)| dimensions.set((x, y))
    });

    // let onload = Callback::from({
    //     let resize = resize.clone();
    //     move |e| resize.emit(e)
    // });
    // let _dimensions = dimensions.clone();

    {
        let div_ref = div_ref.clone();
        use_effect(|| {
            let handler = gloo::events::EventListener::new(&gloo::utils::window(), "resize", {
                move |_event| {
                    // r = (n = Math.floor(e.clientHeight * (5 / 6)), i = t, Math.min(Math.max(n, i), 350));
                    //             var n,
                    //             i;
                    // const l = 6 * Math.floor(r / 5);

                    let h = gloo::utils::document()
                        .get_element_by_id("board-outer")
                        .map(|parent| parent.client_height());
                    // let h: Option<i32> = div_ref.get()
                    //     .and_then(|this| this.parent_element())
                    //     .map(|parent| parent.client_height());

                    // log::info!("height {:?}", h);
                    let (x, y): (i32, i32) = match h {
                        Some(h) => {
                            let n: i32 = (h as f32 * (5. / 6.)).floor() as i32;
                            // let i = 0;
                            let i = 300;
                            // can make this return some and use ? instead of unwrap above
                            let r = i32::min(i32::max(n, i), 350);
                            let l = 6 * (r as f32 / 5.).floor() as i32;
                            log::info!("resized: r: {r} l: {l} n: {n} i: {i} h: {h}");
                            (r, l)
                        }
                        None => (300, 360),
                    };
                    resize.emit((x, y));
                    // resize.emit(event.clone());
                }
            });
            || {
                drop(handler);
            }
        });
    }

    let (r, l) = (dimensions.0, dimensions.1);
    let style = format!("width: {r}px; height: {l}px;");
    log::info!("{}", style);
    html!(
            <div class="board-inner" ref={div_ref} {style}>
                {rows.collect::<Html>()}
            </div>
    )
}

#[function_component]
pub fn Board() -> Html {
    html!(
        <div class="board-outer" id="board-container">
            <InnerBoard />
        </div>
    )
}

type BoardState = [[TileState; 5]; 6];

// TODO: Move gamestate to it's own module
#[derive(Default, Copy, Clone, PartialEq)]
pub struct GameState {
    board_state: BoardState,
    cur_pos: (usize, usize),
    answer: &'static str,
    pub chars: [Option<Correctness>; 30],
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

    fn current_guess(&self) -> [Chr; 5] {
        self.current_row()
            .map(|state| state.current.expect("Guess has Chr"))
    }

    fn update_chars(&mut self, guess_chars: [Chr; 5], correctness: [Correctness; 5]) {
        for (ch, goodness) in zip(guess_chars, correctness) {
            self.chars[ch.to_usize()].replace(goodness);
        }
    }

    fn evaluate_guess(&self) -> ([Chr; 5], [Correctness; 5]) {
        let guess_chars = self.current_guess();
        let guess = String::from_iter(guess_chars.map(Chr::to_char));
        let correctness = Correctness::compute(self.answer, &guess);

        log::info!("Computed Correctness: {:?}", correctness);
        (guess_chars, correctness)
    }

    fn update_tile_states_from_guess(&mut self, guess: [Correctness; 5]) {
        for (correctness, tile_state) in zip(guess, self.current_row_mut()) {
            tile_state.goodness.replace(correctness);
        }
    }

    fn puts(mut self, c: Chr) -> Self {
        if self.cur_pos.1 == 6 {
            return self;
        }
        match c {
            Chr::ENTER => {
                if self.cur_pos.0 == 5 {
                    let (guess_chars, correctness) = self.evaluate_guess();

                    self.update_chars(guess_chars, correctness);
                    self.update_tile_states_from_guess(correctness);

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

    fn new_with_answer() -> Self {
        let answer = driver::generate_answer();
        log::info!("Created Answer: {}", answer);
        Self::new(answer)
    }

    fn reset(self) -> Self {
        Self::new_with_answer()
    }
}

pub enum GameAction {
    KeyPress(Chr),
    Reset,
}

impl Reducible for GameState {
    type Action = GameAction;

    fn reduce(self: Rc<Self>, action: Self::Action) -> Rc<Self> {
        // NOTE: This __copies__ out of RC. Will need to clone, do unsafe,
        // or rethink strategy if GameState can no longer be Copy
        match action {
            GameAction::KeyPress(chr) => self.puts(chr).into(),
            GameAction::Reset => self.reset().into(),
        }
    }
}

pub(crate) type GameContext = UseReducerHandle<GameState>;

#[function_component]
pub fn Header() -> Html {
    let ctx = use_context::<GameContext>().unwrap();
    let onclick = {
        // let ctx = ctx.clone();
        Callback::from(move |_| ctx.dispatch(GameAction::Reset))
    };
    html! {
        <div class="appHeader">
            <div class="appHeader-title">{"Jordle"}</div><div class="menuRight"><button {onclick} class="icon"><img class="reset-icon" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.1BErBCwbAGu1VdPMVnaFDQHaHa%26pid%3DApi&f=1&ipt=3390f753bb1715cc6e3291f12a92e211ec2f5ea05cf3d1f45baa5a383dee3c09&ipo=images" /></button></div>
        </div>
    }
}

#[function_component]
pub fn GameInterface() -> Html {
    let game_no = use_state(| | 0);

    // FIXME!: *sometimes* finishing a row resets the game
    // could be fixed by finding the error or using a struct
    // component for declaring different methods for init and update
    //
    // first run
    let answer = use_memo(move |_step| {
        let answer = driver::generate_answer();
        log::info!("Generated first answer: {answer}");
        answer
    }, game_no);

    let board_state = use_reducer_eq(move | | GameState::new(&answer));

    // NOTE: use_memo takes dependencies:
    // set dependency on game number to calculate
    // a new a answer

    let onclick = Callback::from({
        let board_state = board_state.clone();
        move |code| {
            board_state.dispatch(code);
        }
    });

    {
        // let board_state = board_state.clone();
        let onclick = onclick.clone();
        use_effect(move || {
            let handler = gloo::events::EventListener::new(&gloo::utils::document(), "keydown", {
                move |event| {
                    let event = event.dyn_ref::<web_sys::KeyboardEvent>().unwrap_throw();
                    let key: String = event.key();
                    let chr = Chr::from_str(&key);

                    if let Some(chr) = chr {
                        // board_state.dispatch(GameAction::KeyPress(chr))
                        onclick.emit(GameAction::KeyPress(chr))
                    }
                }
            });

            || drop(handler)
        });
    }

    let style = "height: 90%;";
    html! {
        <div class="game-outer-container" >
            <ContextProvider<GameContext> context={board_state}>
                <Header />
                <div class="game-container" {style}>
                    <div class="game">
                            <Board />
                            <crate::key::Keyboard {onclick}/>
                    </div>
                </div>
            </ContextProvider<GameContext>>
        </div>
    }
}
