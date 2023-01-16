use yew::prelude::*;

use crate::letters::Chr;

#[function_component]
pub fn Tile() -> Html {
    html!(
        <div class="tile"></div>
    )
}

#[function_component]
pub fn Row() -> Html {
    // let row_height = (10.0 / 6.0) as u32;
    let boxes = (1..=5).map(|_| html! { <Tile /> });
    html!(
        <div class="row">{boxes.collect::<Html>()}</div>
    )
}

#[function_component]
pub fn Board() -> Html {
    let rows = (1..=6).map(|_| html! { <Row /> });
    html!(
        <div class="board-outer">
            <div class="board-inner" style="width: 60%; height: 60%;">
                {rows.collect::<Html>()}
            </div>
        </div>
    )
}

#[function_component]
pub fn Clicker() -> Html {
    let counter = use_state(|| 0);
    let onclick = {
        let counter = counter.clone();
        move |_| {
            let value = *counter + 1;
            counter.set(value);
        }
    };
    html! {
        <div>
            <button {onclick}>{ "+1" }</button>
            <p>{ *counter }</p>
        </div>
    }
}

// pub struct Game {
//     board: [[Chr; 5]; 6],
//     // current_row: u8;
// }

// pub struct 
//
// impl Component for Game {
//     type Message;
//
//     type Properties;
//
//     fn create(ctx: &Context<Self>) -> Self {
//         todo!()
//     }
//
//     fn view(&self, ctx: &Context<Self>) -> Html {
//         todo!()
//     }
// }
//

#[function_component]
pub fn Game() -> Html {

    let onclick = Callback::from(
        move |code| {
            log::info!("pressed key: {}", code);
        }
    );
    html! {
        <div class="game">
            <Board />
            <crate::key::Keyboard {onclick}/>
        </div>
    }
}

