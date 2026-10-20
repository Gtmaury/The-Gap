"""Build large Tatoeba collections for The Gap.

Sentences stay under Tatoeba's CC BY 2.0 FR license. This does not copy
Clozemaster's catalog, order, or cloze choices.
"""

import bz2
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "data" / "tatoeba"
OUT = Path(__file__).resolve().parent / "library.js"
PACK_SIZE = 1000
PACKS = 4
BASE = "https://downloads.tatoeba.org/exports/per_language"
FREQ = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018"

FILES = {
    "eng_sentences.tsv.bz2": f"{BASE}/eng/eng_sentences.tsv.bz2",
    "spa_sentences.tsv.bz2": f"{BASE}/spa/spa_sentences.tsv.bz2",
    "fra_sentences.tsv.bz2": f"{BASE}/fra/fra_sentences.tsv.bz2",
    "eng-spa_links.tsv.bz2": f"{BASE}/eng/eng-spa_links.tsv.bz2",
    "eng-fra_links.tsv.bz2": f"{BASE}/eng/eng-fra_links.tsv.bz2",
    "en_50k.txt": f"{FREQ}/en/en_50k.txt",
    "es_50k.txt": f"{FREQ}/es/es_50k.txt",
    "fr_50k.txt": f"{FREQ}/fr/fr_50k.txt",
}

STOP = {
    "en": {
        "the", "a", "an", "of", "to", "and", "in", "is", "it", "for", "on", "that",
        "this", "with", "as", "at", "by", "from", "or", "be", "are", "was", "were",
        "been", "have", "has", "had", "do", "does", "did", "will", "would", "can",
        "could", "should", "may", "might", "not", "no", "but", "if", "so", "than",
        "then", "too", "very", "just", "about", "into", "over", "after", "i", "you",
        "he", "she", "we", "they", "me", "him", "her", "us", "them", "my", "your",
        "his", "its", "our", "their", "what", "which", "who",
    },
    "es": {
        "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al",
        "y", "o", "u", "e", "que", "en", "a", "con", "por", "para", "su", "sus",
        "mi", "mis", "tu", "tus", "lo", "le", "les", "se", "es", "son", "ser",
        "estar", "está", "están", "no", "si", "sí", "ya", "muy", "más", "como",
        "cuando", "donde", "dónde", "qué", "pero", "también", "entre", "sobre",
        "hasta", "desde", "sin", "yo", "tú", "él", "ella", "nosotros", "me", "te",
    },
    "fr": {
        "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux", "et", "ou",
        "que", "qui", "dont", "en", "a", "à", "dans", "par", "pour", "sur", "avec",
        "sans", "ce", "cet", "cette", "ces", "est", "sont", "être", "avoir", "je",
        "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "ne", "pas",
        "plus", "très", "comme", "quand", "où", "mon", "ma", "mes", "son", "sa",
        "ses", "un", "une", "y", "se", "au",
    },
}

WORD = re.compile(r"[^\W\d_]+(?:['’][^\W\d_]+)?", re.UNICODE)
BAD = re.compile(r"[\d\[\]{}<>@#|\\]|https?://|www\.")


def download(name, url):
    ROOT.mkdir(parents=True, exist_ok=True)
    path = ROOT / name
    if path.exists() and path.stat().st_size > 0:
        print(f"have {name}", flush=True)
        return path
    print(f"download {name}", flush=True)
    urllib.request.urlretrieve(url, path)
    return path


def ranks(path):
    table = {}
    with path.open(encoding="utf-8") as handle:
        for index, line in enumerate(handle):
            word = line.split(" ", 1)[0].strip().lower()
            if word and word not in table:
                table[word] = index + 1
            if index >= 20000:
                break
    return table


def sentences(path, wanted):
    found = {}
    opener = bz2.open if path.suffix == ".bz2" else open
    with opener(path, "rt", encoding="utf-8") as handle:
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            sid, text = parts[0], parts[2]
            if sid in wanted:
                found[sid] = text
    return found


def links(path):
    pairs = []
    ids_a = set()
    ids_b = set()
    with bz2.open(path, "rt", encoding="utf-8") as handle:
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 2:
                continue
            pairs.append((parts[0], parts[1]))
            ids_a.add(parts[0])
            ids_b.add(parts[1])
    return pairs, ids_a, ids_b


def tokens(text):
    return [(match.group(0), match.group(0).lower()) for match in WORD.finditer(text)]


def acceptable(text):
    stripped = text.strip()
    if not stripped or BAD.search(stripped):
        return False
    if stripped[0].islower() is False and stripped[:1].isupper() and stripped[1:2].isupper():
        return False
    count = len(tokens(stripped))
    return 4 <= count <= 12


def score(text, table):
    parts = tokens(text)
    if not parts:
        return None
    total = 0
    unknown = 0
    for _surface, lower in parts:
        rank = table.get(lower)
        if rank is None:
            unknown += 1
            total += 30000
        else:
            total += rank
    if unknown / len(parts) > 0.34:
        return None
    return total / len(parts)


def cloze_for(text, table, stop):
    best = None
    best_rank = -1
    for surface, lower in tokens(text):
        if len(lower) < 3 or lower in stop:
            continue
        rank = table.get(lower, 30000)
        if rank > best_rank:
            best_rank = rank
            best = surface
    return best


def select_pairs(pair_rows, meaning_text, target_text, meaning_ranks, target_ranks, target_code):
    chosen = []
    seen = set()
    for meaning_id, target_id in pair_rows:
        meaning = meaning_text.get(meaning_id)
        target = target_text.get(target_id)
        if not meaning or not target:
            continue
        if not acceptable(meaning) or not acceptable(target):
            continue
        key = target.casefold()
        if key in seen:
            continue
        meaning_score = score(meaning, meaning_ranks)
        target_score = score(target, target_ranks)
        if meaning_score is None or target_score is None:
            continue
        gap = cloze_for(target, target_ranks, STOP[target_code])
        if not gap or gap not in target:
            continue
        seen.add(key)
        chosen.append((meaning_score + target_score, meaning.strip(), target.strip(), gap))
    chosen.sort(key=lambda item: item[0])
    return chosen[: PACK_SIZE * PACKS]


def packs(rows, pair_id, language, source, voice, prefix):
    collections = []
    for index in range(PACKS):
        chunk = rows[index * PACK_SIZE : (index + 1) * PACK_SIZE]
        if len(chunk) < PACK_SIZE:
            break
        start = index * PACK_SIZE + 1
        end = start + PACK_SIZE - 1
        collections.append(
            {
                "id": f"{prefix}-{index + 1}",
                "pairId": pair_id,
                "language": language,
                "from": source,
                "name": f"Most common {start:,}–{end:,}",
                "voice": voice,
                "credit": "Sentences from Tatoeba, CC BY 2.0.",
                "sentences": [[meaning, text, gap] for _score, meaning, text, gap in chunk],
            }
        )
    return collections


def main():
    paths = {name: download(name, url) for name, url in FILES.items()}
    print("reading links", flush=True)
    spa_pairs, eng_for_spa, spa_ids = links(paths["eng-spa_links.tsv.bz2"])
    fra_pairs, eng_for_fra, fra_ids = links(paths["eng-fra_links.tsv.bz2"])
    print(f"links spa {len(spa_pairs)} fra {len(fra_pairs)}", flush=True)
    eng_ids = eng_for_spa | eng_for_fra
    print("reading sentences", flush=True)
    english = sentences(paths["eng_sentences.tsv.bz2"], eng_ids)
    spanish = sentences(paths["spa_sentences.tsv.bz2"], spa_ids)
    french = sentences(paths["fra_sentences.tsv.bz2"], fra_ids)
    print(f"texts en {len(english)} es {len(spanish)} fr {len(french)}", flush=True)
    en_ranks = ranks(paths["en_50k.txt"])
    es_ranks = ranks(paths["es_50k.txt"])
    fr_ranks = ranks(paths["fr_50k.txt"])
    es_rows = select_pairs(spa_pairs, english, spanish, en_ranks, es_ranks, "es")
    fr_rows = select_pairs(fra_pairs, english, french, en_ranks, fr_ranks, "fr")
    en_rows = select_pairs(
        [(target, meaning) for meaning, target in spa_pairs],
        spanish,
        english,
        es_ranks,
        en_ranks,
        "en",
    )
    print(f"kept es {len(es_rows)} en {len(en_rows)} fr {len(fr_rows)}", flush=True)
    collections = []
    collections += packs(es_rows, "en-es", "Spanish", "English", "es-ES", "common-es")
    collections += packs(en_rows, "es-en", "English", "Spanish", "en-US", "common-en")
    collections += packs(fr_rows, "en-fr", "French", "English", "fr-FR", "common-fr")
    payload = json.dumps(collections, ensure_ascii=False, separators=(",", ":"))
    OUT.write_text(f"export const tatoebaCollections = {payload};\n", encoding="utf-8")
    print(f"wrote {OUT} collections {len(collections)} bytes {OUT.stat().st_size}", flush=True)


if __name__ == "__main__":
    main()
