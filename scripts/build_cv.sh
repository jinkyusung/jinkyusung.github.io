#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Rebuilds the CV PDF from `_data/*.yml`:
#   1. `scripts/generate_cv.rb` renders the YAML into `cv/generated/*.tex`
#   2. latexmk compiles `cv/main.tex` inside `cv/build/`
#   3. the PDF is copied to the path the CV entry of `_data/navigation.yml`
#      points at (default: assets/cv/Jinkyu_Sung_CV.pdf), which is what the
#      "CV" button in the site navigation bar downloads.
#
# Usage: ./scripts/build_cv.sh
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v ruby >/dev/null 2>&1; then
    echo "ruby is required to generate the CV sources." >&2
    exit 1
fi

if ! command -v latexmk >/dev/null 2>&1; then
    echo "latexmk (TeX Live / MacTeX) is required to compile the CV." >&2
    exit 1
fi

ruby scripts/generate_cv.rb

OUTPUT_PATH="$(ruby -ryaml -e '
pages = (YAML.load_file("_data/navigation.yml")["pages"] rescue []) || []
entry = pages.find { |p| p["download"] } || pages.find { |p| p["name"].to_s.downcase == "cv" }
print((entry && entry["url"].to_s.sub(%r{\A/}, "")).to_s)
')"
OUTPUT_PATH="${OUTPUT_PATH:-assets/cv/Jinkyu_Sung_CV.pdf}"

echo "Compiling cv/main.tex"
latexmk -pdf -interaction=nonstopmode -halt-on-error \
    -outdir=build -cd cv/main.tex >/dev/null

mkdir -p "$(dirname "$OUTPUT_PATH")"
cp cv/build/main.pdf "$OUTPUT_PATH"
echo "CV written to $OUTPUT_PATH"
