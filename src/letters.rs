#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Chr {
    Q,
    W,
    E,
    R,
    T,
    Y,
    U,
    I,
    O,
    P,
    A,
    S,
    D,
    F,
    G,
    H,
    J,
    K,
    L,
    ENTER,
    Z,
    X,
    C,
    V,
    B,
    N,
    M,
    DEL,
}

use Chr::*;

impl Chr {
    pub fn to_char(self) -> char {
        match self {
            Q => 'q',
            W => 'w',
            E => 'e',
            R => 'r',
            T => 't',
            Y => 'y',
            U => 'u',
            I => 'i',
            O => 'o',
            P => 'p',
            A => 'a',
            S => 's',
            D => 'd',
            F => 'f',
            G => 'g',
            H => 'h',
            J => 'j',
            K => 'k',
            L => 'l',
            Z => 'z',
            X => 'x',
            C => 'c',
            V => 'v',
            B => 'b',
            N => 'n',
            M => 'm',
            ENTER => '+',
            DEL => '-',
        }
    }

    pub fn from_str(str: &str) -> Option<Self> {
        let res = match str {
            "q" => Q,
            "w" => W,
            "e" => E,
            "r" => R,
            "t" => T,
            "y" => Y,
            "u" => U,
            "i" => I,
            "o" => O,
            "p" => P,
            "a" => A,
            "s" => S,
            "d" => D,
            "f" => F,
            "g" => G,
            "h" => H,
            "j" => J,
            "k" => K,
            "l" => L,
            "z" => Z,
            "x" => X,
            "c" => C,
            "v" => V,
            "b" => B,
            "n" => N,
            "m" => M,
            "Enter" => ENTER,
            "Backspace" => DEL,
            _ => return None
        };
        Some(res)
    }

    pub fn to_str(self) -> &'static str {
        match self {
            Q => "q",
            W => "w",
            E => "e",
            R => "r",
            T => "t",
            Y => "y",
            U => "u",
            I => "i",
            O => "o",
            P => "p",
            A => "a",
            S => "s",
            D => "d",
            F => "f",
            G => "g",
            H => "h",
            J => "j",
            K => "k",
            L => "l",
            Z => "z",
            X => "x",
            C => "c",
            V => "v",
            B => "b",
            N => "n",
            M => "m",
            ENTER => "ENTER",
            DEL => "DEL",
        }
    }

    // NOTE: could do this with an enum and avoid the Vec allocations
    // but it's not that big of a deal
    pub fn get_row(row: u32) -> Vec<Chr> {
        match row {
            0 => ROW1.to_vec(),
            1 => ROW2.to_vec(),
            2 => ROW3.to_vec(),
            _ => panic!("invalid row"),
        }
    }
}

const ROW1: [Chr; 10] = [Q, W, E, R, T, Y, U, I, O, P];
const ROW2: [Chr; 9] = [A, S, D, F, G, H, J, K, L];
const ROW3: [Chr; 9] = [ENTER, Z, X, C, V, B, N, M, DEL];

impl std::fmt::Display for Chr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.to_str())
    }
}
