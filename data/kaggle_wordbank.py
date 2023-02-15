import pandas

df = pandas.read_csv('./unigram_freq.csv')

bank = {}

for leng in range(4,10):
    words = df[df['word'].str.len()==leng]
    words.to_csv('./wordbank/{}_kaggle.csv'.format(leng), index=False)
