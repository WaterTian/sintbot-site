#!/usr/bin/env python3
"""Pin the site's roundness and used weight range; retain optical sizing and all Latin glyphs.

Requires fonttools[woff]. Original and derived fonts remain under the adjacent SIL OFL.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent / "assets" / "fonts"
source = root / "google-sans-flex-latin.woff2"
target = root / "google-sans-flex-rounded-latin.woff2"
font = instantiateVariableFont(TTFont(source), {"ROND": 100, "wght": (400, 400, 750)})
font.save(target)
print(f"Google Sans Flex: {source.stat().st_size} → {target.stat().st_size} bytes")
