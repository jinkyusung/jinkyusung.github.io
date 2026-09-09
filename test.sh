#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

if ! command -v bundle >/dev/null 2>&1; then
    echo "Bundler is required. Install it with: gem install bundler" >&2
    exit 1
fi

if ! bundle check; then
    bundle install
fi

exec bundle exec jekyll serve --livereload --host 127.0.0.1 "$@"
