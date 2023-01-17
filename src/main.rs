use yew::prelude::*;

mod key;
mod letters;
mod game;
use game::Game;

#[function_component]
pub fn App() -> Html {
    html! {
        <Game />
    }
}

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    yew::Renderer::<App>::new().render();
}
