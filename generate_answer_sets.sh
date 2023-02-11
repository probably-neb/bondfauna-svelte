#!/bin/bash

NGRAMS_DIR=data/ngrams

if [[ ! -d $NGRAMS_DIR ]]; then
    mkdir -p data/ngrams
    for i in {0..23}; do
        num=$(printf "%02d" $i)
        url="http://storage.googleapis.com/books/ngrams/books/20200217/eng/1-000${num}-of-00024.gz"
        echo $url
        curl -LO --output-dir $NGRAMS_DIR $url
    done
fi

[[ "$1" == "-b" ]]
BUILD=$?

echo "BUILD: $BUILD"

if "$BUILD"; then
    cd roget/corpus 
    cargo b --release || exit 1
    cd ../..
fi

CORPUS_BIN=roget/corpus/target/release/corpus

for i in {4..9}; do
    file="${i}_letter_answers"
    file_name="$file.txt"
    if [[ $i -eq 5 ]]; then
        # use nyt data for 5 letter words
        file_name="possible_answers.txt"
    # only build if not using nyt data
    elif "$BUILD"; then
        echo "Building $file_name"
        $CORPUS_BIN ${i} ${NGRAMS_DIR}/*.gz | tee $file_name
    fi
    # will still use n_letter_answers format for nyt 5 letter words
    json_file="$file.json"
    echo "generating ${json_file}"
    #              | word of {word} {count}   | sort | convert to json array
    # TODO: generate blacklist of words based on non words 
    cat $file_name | awk -F' ' '{ print $1 }' | sort | jq -MRn '[inputs]' > "$json_file"
done
