import sys


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


files = sys.argv[1:]

# file_name = f"{len}_letter_answers.txt"
for file in files:
    sort_file(file)
