#!/usr/bin/env python3
"""Быстрый QA-рендер .kicad_pcb без KiCad: контур Edge.Cuts + площадки + подписи футпринтов.

Использование: python3 tools/plot_pcb.py output/pcbs/corne_pcb.kicad_pcb out.png
"""
import math
import re
import sys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon


def parse_sexp(text):
    tokens = re.findall(r'\(|\)|"(?:[^"\\]|\\.)*"|[^\s()]+', text)
    stack, cur = [], []
    for t in tokens:
        if t == "(":
            stack.append(cur)
            cur = []
        elif t == ")":
            done = cur
            cur = stack.pop()
            cur.append(done)
        else:
            cur.append(t.strip('"'))
    return cur[0]


def find(node, name):
    return [c for c in node if isinstance(c, list) and c and c[0] == name]


def first(node, name):
    r = find(node, name)
    return r[0] if r else None


def rot(x, y, deg):
    t = math.radians(deg)
    return x * math.cos(t) + y * math.sin(t), -x * math.sin(t) + y * math.cos(t)


def main(src, dst):
    root = parse_sexp(open(src, encoding="utf-8").read())
    fig, ax = plt.subplots(figsize=(12, 9))

    for g in find(root, "gr_line"):
        layer = first(g, "layer")
        if layer and layer[1] == "Edge.Cuts":
            s, e = first(g, "start"), first(g, "end")
            ax.plot([float(s[1]), float(e[1])], [float(s[2]), float(e[2])], "k-", lw=1.5)
    for g in find(root, "gr_arc"):
        layer = first(g, "layer")
        if layer and layer[1] == "Edge.Cuts":
            pts = [first(g, k) for k in ("start", "mid", "end")]
            ax.plot([float(p[1]) for p in pts], [float(p[2]) for p in pts], "k-", lw=1.5)

    colors = {"mcu": "tab:red", "switch_choc": "tab:blue", "diode": "tab:green",
              "power": "tab:orange", "reset": "tab:purple", "battery": "tab:brown",
              "mounting": "gray", "display": "tab:pink"}
    for fp in find(root, "footprint"):
        name = fp[1].split(":")[-1]
        at = first(fp, "at")
        fx, fy = float(at[1]), float(at[2])
        fr = float(at[3]) if len(at) > 3 else 0.0
        color = next((c for k, c in colors.items() if k in name), "black")
        for pad in find(fp, "pad"):
            pat, size = first(pad, "at"), first(pad, "size")
            if not pat or not size:
                continue
            px, py = float(pat[1]), float(pat[2])
            w, h = float(size[1]), float(size[2])
            prot = float(pat[3]) if len(pat) > 3 else fr
            gx, gy = rot(px, py, fr)
            corners = []
            for cx, cy in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)):
                rx, ry = rot(cx, cy, prot)
                corners.append((fx + gx + rx, fy + gy + ry))
            ax.add_patch(Polygon(corners, closed=True, fc=color, ec=color, alpha=0.5))
        if any(k in name for k in ("mcu", "power", "reset", "battery", "display")):
            ax.annotate(name.replace("_", " "), (fx, fy), fontsize=8, color=color,
                        ha="center", va="center", weight="bold",
                        bbox=dict(boxstyle="round", fc="white", ec=color, alpha=0.8))

    ax.set_aspect("equal")
    ax.invert_yaxis()
    ax.set_title(src)
    fig.tight_layout()
    fig.savefig(dst, dpi=90)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
