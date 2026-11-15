"""
Build the single-file app.

1. Runs parse_tides.py  → bakes the official KMFRI tables into index.html
2. Bakes logo.png in as a data URI so the app stays ONE file with no loose assets

Run:  python build.py
"""

import base64
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)

print("1/2  parsing the KMFRI booklet…")
subprocess.run([sys.executable, "parse_tides.py"], check=True)

print("2/2  embedding the logo…")
png = open("logo-dark.png", "rb").read()
uri = "data:image/png;base64," + base64.b64encode(png).decode()

html = open("index.html", encoding="utf-8").read()
if "__LOGO__" in html:
    html = html.replace("__LOGO__", uri)
    open("index.html", "w", encoding="utf-8").write(html)
    print("     logo embedded (%d KB of base64)" % (len(uri) // 1024))
else:
    print("     logo already embedded, nothing to do")

print("\nindex.html is ready — %d KB, one file, no external assets." % (len(html.encode("utf-8")) // 1024))
