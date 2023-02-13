#!/bin/bash

NGRAMS_DIR=ngrams

if [[ ! -d $NGRAMS_DIR ]]; then
    mkdir -p data/ngrams
fi

for i in {0..23}; do
    num=$(printf "%02d" $i)
    url="http://storage.googleapis.com/books/ngrams/books/20200217/eng/1-000${num}-of-00024.gz"
    echo $url
    curl -LO --output-dir $NGRAMS_DIR $url
done
