#!/usr/bin/env bash
# compress-videos.sh
# Compresses all mp4 files in public/artifacts using ffmpeg.
# Run BEFORE deploying if total project size exceeds 95MB.
# Requires: ffmpeg (install via https://ffmpeg.org/download.html)
#
# Usage: bash scripts/compress-videos.sh

set -e

INPUT_DIR="public/artifacts"
OUTPUT_DIR="public/artifacts/compressed"
mkdir -p "$OUTPUT_DIR"

for f in "$INPUT_DIR"/*.mp4; do
  name=$(basename "$f")
  echo "Compressing $name..."
  ffmpeg -i "$f" \
    -vcodec libx264 -crf 28 -preset fast \
    -acodec aac -b:a 128k \
    -movflags +faststart \
    "$OUTPUT_DIR/$name" -y
  echo "Done: $OUTPUT_DIR/$name"
done

echo ""
echo "Compressed files are in $OUTPUT_DIR"
echo "Replace public/artifacts/*.mp4 with those files if needed."
echo "Then update site.config.ts paths if you moved them."
