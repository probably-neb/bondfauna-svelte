use rand::prelude::*;
use std::fs::File;
use std::io::Lines;
use std::io::{BufRead, BufReader};
use std::path::Path;

const LINES_IN_ANSWERS_FILE: usize = 2309;
const ANSWERS: &str = include_str!("../possible_answers.txt");

pub fn generate_answer() -> &'static str {
    let mut rng = thread_rng();
    let line = rng.gen_range(0..LINES_IN_ANSWERS_FILE);
    let answer = ANSWERS.lines().nth(line).unwrap();
    answer
}

// fn iter_answers() -> impl Iterator<Item=&'static str> {
//     return ANSWERS.lines()
// }
