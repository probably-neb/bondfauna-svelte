#!/bin/bash

cd wasm-wordle
wasm-pack build --target web

rm -rf ../src/wasm-wordle/*
cp -r pkg/* ../src/wasm-wordle/
cd ..
yarn install
yarn upgrade wasm-wordle
