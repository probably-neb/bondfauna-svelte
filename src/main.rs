use yew::prelude::*;

mod key;
mod letters;
mod game;
mod driver;

#[function_component]
pub fn App() -> Html {
    html! {
        <game::GameInterface />
    }
}

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    yew::Renderer::<App>::new().render();
}
