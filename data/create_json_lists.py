from pathlib import Path
import json
import argparse
import random

wordlens = [4, 5, 6, 7, 8, 9]

wordbanks = { len : f"wordbank/{len}_letter_words.txt" for len in wordlens }

ANSWERS_DIR = Path("answers")
ALLOWED_DIR = Path("allowed")

DEFAULT_NUM_ANSWERS=1500
DEFAULT_NUM_ALLOWED=3000

parser = argparse.ArgumentParser()
parser.add_argument("--answers", "-a", dest="answers", type=int, default=DEFAULT_NUM_ANSWERS)
parser.add_argument("--allowed", "-l", dest="allowed", type=int, default=DEFAULT_NUM_ALLOWED)

def sort_file(file_name):
    with open(file_name, "r") as f:
        lines = f.readlines()
        entries = []
        for line in lines:
            w, v = line.strip().split(" ")
            entries.append((w, int(v)))
        s = sorted(entries, key=lambda wv: wv[1])
    out = '\n'.join(map("{} {}".format, *zip(*s)))
    with open(file_name, "w") as f:
        f.write(out)

def get_allowed(file_name, num):
    with open(file_name, "r") as f:
        lines = f.readlines()[-num:]
    words = []
    for line in lines:
        w, v = line.strip().split(" ")
        words.append(w)
    words = sorted(words)
    return words
    
def get_answers(allowed, num):
    return random.sample(allowed, num)
    
def write_json(dir: Path, len: int, data: [str]):
    with open(dir / f"{len}.json", "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    args = parser.parse_args()

    assert args.allowed > args.answers, "more words must be allowed than be answers"

    for len, file in wordbanks.items():
        allowed = get_allowed(file, args.allowed)
        answers = get_answers(allowed, args.answers)
        write_json(ALLOWED_DIR, len, allowed)
        write_json(ANSWERS_DIR, len, answers)
