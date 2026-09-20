# jinkyusung.github.io

Personal academic website ([jinkyusung.github.io](https://jinkyusung.github.io)) **and** the
LaTeX CV, both generated from one set of files.

## One source of truth

Everything factual lives in `_data/*.yml`. Jekyll renders the website from it and
`scripts/generate_cv.rb` renders the CV's LaTeX sources from the very same files, so the
two can no longer disagree.

```
                    ┌──────────────────────┐
                    │      _data/*.yml     │   <- the only files you edit
                    └──────────┬───────────┘
              Jekyll ┌─────────┴─────────┐ scripts/generate_cv.rb
                     ▼                   ▼
             website (HTML)      cv/generated/*.tex
                                         │ latexmk
                                         ▼
                            assets/cv/Jinkyu_Sung_CV.pdf
                            (the "CV" button in the navbar)
```

| File | Feeds |
| --- | --- |
| `_data/profile.yml` | name, contact links, bio, research interests, education |
| `_data/experience.yml` | experience |
| `_data/publications.yml` | publications (website list + CV `[C*]` / `[P*]` entries) |
| `_data/research_grants.yml` | research grants |
| `_data/awards.yml` | honors & awards |
| `_data/academic_service.yml` | academic service |
| `_data/navigation.yml` | navbar entries, incl. where the CV PDF is published |

A handful of fields are commented `[CV]` (e.g. `location`) or `[WEB]` (e.g. `logo`,
`short_bio`) because only one of the two outputs has a sensible place for them. Everything
else is rendered in both.

## Updating the CV

1. Edit the relevant `_data/*.yml` file.
2. Run the build:

   ```bash
   ./scripts/build_cv.sh
   ```

   This regenerates `cv/generated/*.tex`, compiles `cv/main.tex` with `latexmk`, and writes
   `assets/cv/Jinkyu_Sung_CV.pdf` — the file the navbar's **CV** button downloads.
3. Commit the change. If you skip step 2, the **Build CV** GitHub Action does it for you on
   push to `main` and commits the refreshed PDF back to the repository.

Requirements for a local build: Ruby (already needed by Jekyll) and a TeX distribution with
`latexmk` (MacTeX / TeX Live). CI uses TeX Live through `xu-cheng/latex-action`.

## Layout vs. content

- `cv/main.tex` — page geometry and spacing only. Safe to tweak by hand.
- `cv/resume.cls` — the document class.
- `cv/generated/` — **generated, never edit**; it is git-ignored and rebuilt on every run.
- `_includes/widgets/` — the website's rendering of the same data.

Two CV rendering options live in `_data/profile.yml`: `cv_header_links` (which contact links
appear under the name, in order) and `cv_author_marks` (set to `false` to drop the
`*` / `†` author marks and their legend from the publication list).

## Running the website locally

```bash
./test.sh
```
