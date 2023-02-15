import sys
import matplotlib.pyplot as plt
import pandas
from pandas import DataFrame

len = int(sys.argv[1])
NGRAMS = False
KAGGLE = True

if NGRAMS:
    path = f"./wordbank/{len}_letter_words.txt"
    data: DataFrame = pandas.read_csv(path, sep=" ", header=None)
elif KAGGLE:
    path = f"./wordbank/{len}_kaggle.csv"
    data: DataFrame = pandas.read_csv(path)
# data.set_index(1, inplace=True)
data.plot(y=1, logy=True)
plt.show(block=True)
