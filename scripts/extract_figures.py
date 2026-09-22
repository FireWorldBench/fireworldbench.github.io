"""Extract original paper artwork without modifying the source PDF.

Requires PyMuPDF and Pillow. Run from any working directory. Full figure crops
are rendered at 288 dpi; single hero cells use their native embedded pixels.
"""
from io import BytesIO
from pathlib import Path
import json

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "dist" / "assets" / "paper.pdf"
OUT = ROOT / "dist" / "assets"
OUT.mkdir(parents=True, exist_ok=True)
document = fitz.open(SOURCE)
manifest = []


def save_image(name, image, **source):
    path = OUT / f"{name}.webp"
    image.convert("RGB").save(path, "WEBP", quality=94, method=6)
    manifest.append({"file": path.name, "width": image.width,
                     "height": image.height, **source})


def crop(name, page, rect, **metadata):
    pix = document[page - 1].get_pixmap(matrix=fitz.Matrix(4, 4),
                                       clip=fitz.Rect(rect), alpha=False)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    save_image(name, image, page=page, crop_points=rect,
               method="page crop at 288 dpi", **metadata)


crop("overview", 1, [71, 249, 525, 569], figure=1)
crop("pipeline", 9, [244, 108, 526, 242], figure=4)
crop("real-world", 10, [80, 86, 516, 449], figure=5,
     label="Real-world-aligned fire-world reconstruction")

scenes = [
    (65, "transport", "Transportation and Infrastructure",
     "Electric Bus Terminal Charging-bay Fire"),
    (66, "office", "Office and Digital Facilities",
     "Data-centre Cold-aisle Cable-tray Fire"),
    (67, "healthcare", "Healthcare and Education",
     "Teaching Medical Laboratory Solvent-bench Fire"),
    (68, "commercial", "Commercial and Public Spaces",
     "Public Atrium Kiosk Fire"),
    (69, "residential", "Residential and Care Settings",
     "Night-shift Care Ward Linen-cart Fire"),
    (70, "industrial", "Industry, Energy, and Logistics",
     "Integrated Refinery Pipe-rack Energy Fire"),
    (71, "wildland", "Wildland and Wildland–Urban Interface",
     "Hillside WUI Evacuation-lane Fire"),
]
for page, slug, family, scene in scenes:
    images = document[page - 1].get_image_info()
    top = min(i["bbox"][1] for i in images)
    bottom = max(i["bbox"][3] for i in images)
    crop(f"scene-{slug}", page, [80, round(top - 1.5, 3), 516,
                                round(bottom + 1.5, 3)],
         figure=page - 49, family=family, scene=scene)

# Image xrefs refer to this supplied PDF, not an external re-creation.
hero = [
    ("hero-real-fire", 1, 1751, "Real fire event photograph shown in Figure 1"),
    ("hero-observation", 10, 602, "Observed experimental video frame"),
    ("hero-geometry", 10, 609, "Aligned 3D reconstruction"),
    ("hero-temperature", 10, 616, "Simulation-completed temperature field"),
    ("hero-soot", 10, 622, "Simulation-completed soot-density field"),
    ("hero-scene", 65, 307, "Electric bus terminal 3D geometry"),
]
for name, page, xref, label in hero:
    image = Image.open(BytesIO(document.extract_image(xref)["image"]))
    save_image(name, image, page=page, xref=xref,
               method="native embedded image", label=label)

(OUT / "paper-assets.json").write_text(json.dumps(manifest, indent=2,
                                                 ensure_ascii=False),
                                      encoding="utf-8")
for entry in manifest:
    print(f"{entry['file']}: {entry['width']} x {entry['height']}")
