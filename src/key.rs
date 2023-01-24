use std::fmt;

use crate::letters::Chr;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct KeyProps {
    code: Chr,
    onclick: Callback<Chr>,
}

#[function_component]
fn Key(props: &KeyProps) -> Html {
    let code = props.code;
    let onclick = props.onclick.reform({
        move |_| code
    });
    let is_spacer = matches!(code, Chr::SPACER);
    html! {
        if is_spacer {
            <div class="key" data-type="spacer"></div>
        } else {
            <button {onclick} class="key" data-type={code.get_type()}>{code}</button>
        }
    }
}

macro_rules! keyboard_row {
    ($row:expr => $onclick:ident) => {{
        let keys = Chr::get_row($row);
        html! {
            <div class="keyboard-row">
                {keys.iter().map(|&code| {
                    // let code = code.to_char().to_string();
                    let onclick = $onclick.clone();
                    html! { <Key {code} {onclick} />}
            }
            ).collect::<Html>()}
            </div>
        }
    }};
}

#[function_component]
pub fn Keyboard(props: &KeyboardProps) -> Html {
    let onclick = props.onclick.clone();
    html! {
        <div class="keyboard">
            {keyboard_row!(0 => onclick )}
            {keyboard_row!(1 => onclick )}
            {keyboard_row!(2 => onclick )}
        </div>
    }
}

#[derive(Properties, PartialEq)]
pub struct KeyboardProps {
    pub onclick: Callback<Chr>,
}
