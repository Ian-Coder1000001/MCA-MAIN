"""
Image compression utilities.
Called from model save() methods to compress uploaded images
before they hit the filesystem / media storage.
"""
import io
import os
import logging

from PIL import Image

logger = logging.getLogger("website")

MAX_DIMENSION  = 1920   # max px on longest side
JPEG_QUALITY   = 82     # 82 = ~60-80% smaller, visually identical on web
RECODE_FORMATS = {"JPEG", "PNG", "WEBP", "BMP", "TIFF"}


def compress_image(image_field):
    """
    Compress an ImageField in-place and return the new relative path
    so the model can update its field before saving.

    Returns the new relative path string if compression happened,
    or None if skipped.
    """
    if not image_field or not image_field.name:
        return None

    try:
        # image_field.path is the absolute filesystem path
        abs_path = image_field.path
    except (ValueError, FileNotFoundError):
        return None

    if not os.path.exists(abs_path):
        logger.warning("compress_image: file not found: %s", abs_path)
        return None

    try:
        img = Image.open(abs_path)
        img.load()  # force read so we can close the file handle
    except Exception as exc:
        logger.warning("compress_image: cannot open image: %s — %s", abs_path, exc)
        return None

    fmt = img.format or "JPEG"

    # Skip animated GIFs
    if fmt == "GIF":
        return None

    if fmt not in RECODE_FORMATS:
        return None

    # ── Resize if larger than MAX_DIMENSION on any side ──────────────────
    w, h   = img.size
    factor = MAX_DIMENSION / max(w, h)
    if factor < 1.0:
        new_w = int(w * factor)
        new_h = int(h * factor)
        img   = img.resize((new_w, new_h), Image.LANCZOS)

    # ── Convert to RGB (strips alpha, required for JPEG) ──────────────────
    if img.mode in ("RGBA", "P", "LA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        mask = img.split()[-1] if img.mode in ("RGBA", "LA") else None
        bg.paste(img, mask=mask)
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # ── Build new path with .jpg extension ───────────────────────────────
    base_abs, _old_ext = os.path.splitext(abs_path)
    new_abs  = base_abs + ".jpg"

    # Write compressed file
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    buf.seek(0)
    with open(new_abs, "wb") as fout:
        fout.write(buf.read())

    # Remove old file if extension changed
    if new_abs != abs_path:
        try:
            os.remove(abs_path)
        except OSError:
            pass

    # Return the new RELATIVE path (relative to MEDIA_ROOT)
    # so the caller can update the ImageField.name before saving
    media_root = os.path.dirname(os.path.dirname(abs_path))  # rough fallback
    try:
        from django.conf import settings as djsettings
        media_root = str(djsettings.MEDIA_ROOT)
    except Exception:
        pass

    new_rel = os.path.relpath(new_abs, media_root).replace("\\", "/")
    return new_rel


def validate_video_upload_size(file, max_mb=10):
    """Raise ValidationError if an uploaded video exceeds max_mb."""
    from django.core.exceptions import ValidationError
    if file and hasattr(file, "size"):
        limit = max_mb * 1024 * 1024
        if file.size > limit:
            raise ValidationError(
                f"Video file too large. Maximum size is {max_mb} MB. "
                "Please upload a smaller file or paste a YouTube/Vimeo URL instead."
            )
