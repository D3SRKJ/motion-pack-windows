#!/bin/bash
# Motion Pack – one-command release.
# Builds the app from your source, backs the source up, and publishes the update.
# Everyone's Motion Pack updates itself the next time it opens.
# Usage:  release "what changed"
set -e
export PYTHONUTF8=1
SRC="$HOME/OneDrive/Documents/Motion pack source/MotionPack-Source"
REPO="$HOME/OneDrive/Documents/GitHub/motion-pack-windows"
MSG="${1:-Motion Pack update}"

echo ""
echo "  [1/4] Building the app from your source..."
cd "$SRC"
cp motion-pack.bak7.html motion-pack.html
OUT=$(python patch29.py 2>&1 | tail -1)
if [ "$OUT" != "ok29" ]; then echo "  Build failed: $OUT"; echo "  Nothing was published. Send Claude a screenshot."; exit 1; fi
python build.py >/dev/null
rm -f motion-pack.html

echo "  [2/4] Backing up your source to GitHub..."
git add -A
if git diff --cached --quiet; then echo "        (source already backed up)"; else git commit -q -m "$MSG" && git push -q && echo "        done"; fi

echo "  [3/4] Preparing the update..."
cp app/index.html "$REPO/app/index.html"
cp src/main.js src/preload.js "$REPO/"
cd "$REPO"
git add -A
if git diff --cached --quiet; then echo ""; echo "  Nothing new to publish - the app is already up to date."; exit 0; fi
git commit -q -m "$MSG"

echo "  [4/4] Publishing..."
git push -q
echo ""
echo "  Published: $MSG"
echo "  GitHub is building it now (about 5-10 minutes)."
echo "  Watch it here: https://github.com/D3SRKJ/motion-pack-windows/actions"
echo "  After that, every Motion Pack updates itself the next time it opens."
echo ""
