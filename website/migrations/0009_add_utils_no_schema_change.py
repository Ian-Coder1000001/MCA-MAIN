"""
Migration 0009 — no database schema changes.

The image compression and video size validation happen entirely in
Python (model save() and clean() methods) using the new utils.py file.
No new columns or tables are needed — this migration exists only to
mark the dependency chain so Django's migration graph stays consistent.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0008_image_upload_fields"),
    ]

    operations = [
        # No database operations — compression is handled in model save()
    ]
