#!/bin/bash

NGRAMS_DIR=ngrams
CORPUS_DIR=../roget/corpus

echo $(
    cd $CORPUS_DIR
    cargo b --release || exit 1
)

CORPUS_BIN="${CORPUS_DIR}/target/release/corpus"

WORDBANK_DIR="wordbank"

if [[ ! -d $WORDBANK_DIR ]]; then
    mkdir $WORDBANK_DIR
fi

for i in {4..9}; do
    file_name="${WORDBANK_DIR}/${i}_letter_words.txt"
    echo "Building $file_name"
    $CORPUS_BIN ${i} ${NGRAMS_DIR}/*.gz | tee $file_name
    # will still use n_letter_answers format for nyt 5 letter words
    # json_file="$file.json"
    # echo "generating ${json_file}"
    #              | word of {word} {count}   | sort | convert to json array
    # TODO: generate blacklist of words based on non words 
    # cat $file_name | awk -F' ' '{ print $1 }' | sort | jq -MRn '[inputs]' > "$json_file"
done
    # if [[ $i -eq 5 ]]; then
    #     # use nyt data for 5 letter words
    #     file_name="possible_answers.txt"
    # # only build if not using nyt data
    # # elif "$BUILD"; then
    # else
