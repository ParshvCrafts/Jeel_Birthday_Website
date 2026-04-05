#!/usr/bin/env bash
# compress-videos.sh
# Compresses all mp4 files in public/artifacts using ffmpeg.
# Run BEFORE deploying if total project size exceeds 95MB.
# Requires: ffmpeg (install via https://ffmpeg.org/download.html)
#
# Usage: bash scripts/compress-videos.sh
# (Run from anywhere — script anchors paths to project root)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$PROJECT_ROOT/public/artifacts"
OUTPUT_DIR="$PROJECT_ROOT/public/artifacts/compressed"
mkdir -p "$OUTPUT_DIR"

# Preflight: require ffmpeg
if ! command -v ffmpeg &>/dev/null; then
  echo "ERROR: ffmpeg not found. Install it from https://ffmpeg.org/download.html"
  exit 1
fi

# Collect mp4 files (nullglob-safe)
shopt -s nullglob
files=("$INPUT_DIR"/*.mp4)
if [ ${#files[@]} -eq 0 ]; then
  echo "No .mp4 files found in $INPUT_DIR. Nothing to compress."
  exit 0
fi

for f in "${files[@]}"; do
  name=$(basename "$f")
  out="$OUTPUT_DIR/$name"
  if [ -f "$out" ]; then
    echo "Skipping $name (already exists — delete $out to re-compress)"
    continue
  fi
  echo "Compressing $name..."
  ffmpeg -y -i "$f" \
    -vcodec libx264 -crf 28 -preset fast \
    -acodec aac -b:a 128k \
    -movflags +faststart \
    -loglevel warning \
    "$out"
  echo "Done: $out"
done

echo ""
echo "Compressed files are in $OUTPUT_DIR"
echo "Replace public/artifacts/*.mp4 with those files if needed."
echo "Then re-run: npm run build"
