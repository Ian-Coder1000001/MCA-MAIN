from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from .utils import compress_image, validate_video_upload_size


# ─────────────────────────────────────────────────────────────────────────────
# VALIDATORS
# ─────────────────────────────────────────────────────────────────────────────

def validate_image_size(file):
    limit = 20 * 1024 * 1024
    if file and hasattr(file, "size") and file.size > limit:
        raise ValidationError("Image too large (max 20 MB). Tip: paste an external URL instead.")


def validate_video_size(file):
    validate_video_upload_size(file, max_mb=10)


def _compress_and_save(instance, field_name, update=True):
    """
    Helper: compress the ImageField, update the field name in DB if
    the extension changed, then optionally save.
    """
    field = getattr(instance, field_name)
    if not field or not field.name:
        return
    new_path = compress_image(field)
    if new_path and new_path != field.name:
        # Update the field name so the DB stores the correct .jpg path
        field.name = new_path
        if update:
            instance.__class__.objects.filter(pk=instance.pk).update(
                **{field_name: new_path}
            )


# ─────────────────────────────────────────────────────────────────────────────
# SITE SETTINGS  (single row — hero + about)
# ─────────────────────────────────────────────────────────────────────────────
class SiteSettings(models.Model):
    candidate_name  = models.CharField(max_length=100, default="Elphas Shilosio")
    tagline         = models.CharField(max_length=200, default="Building a better Murhanda — together.")
    bio_short       = models.TextField(default="Proven leadership, real projects, and a bold agenda for every resident of Murhanda Ward.")
    photo           = models.ImageField(upload_to="site/", blank=True, null=True,
                                        validators=[validate_image_size],
                                        help_text="Upload candidate photo (auto-compressed). OR paste a URL below.")
    photo_url       = models.URLField(blank=True, default="",
                                      help_text="External photo URL (Cloudinary, Google Drive, etc.)")
    video_url       = models.URLField(blank=True, default="",
                                      help_text="YouTube link e.g. https://www.youtube.com/watch?v=ABC123  — or paste full embed code")
    video_title     = models.CharField(max_length=200, blank=True, default="Murhanda Rising — Our Work in Action")

    bio             = models.TextField(blank=True, default="",
                                       help_text="Full biography shown on the About page.")
    vision          = models.TextField(blank=True, default="",
                                       help_text="Vision statement shown on the About page.")
    commitment      = models.TextField(blank=True, default="",
                                       help_text="Commitment / dedication statement on the About page.")
    about_photo     = models.ImageField(upload_to="site/", blank=True, null=True,
                                        validators=[validate_image_size],
                                        help_text="Upload About page photo (auto-compressed). OR paste a URL below.")
    about_photo_url = models.URLField(blank=True, default="",
                                      help_text="External About page photo URL.")

    class Meta:
        verbose_name        = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
        _compress_and_save(self, "photo")
        _compress_and_save(self, "about_photo")

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def get_photo_url(self, request=None):
        if self.photo_url:
            return self.photo_url
        if self.photo:
            url = self.photo.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_about_photo_url(self, request=None):
        if self.about_photo_url:
            return self.about_photo_url
        if self.about_photo:
            url = self.about_photo.url
            return request.build_absolute_uri(url) if request else url
        return None


class HeroStat(models.Model):
    settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name="stats")
    label    = models.CharField(max_length=100)
    value    = models.CharField(max_length=50)
    order    = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.label}: {self.value}"


class TimelineEntry(models.Model):
    settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name="timeline")
    year     = models.CharField(max_length=10)
    event    = models.TextField()
    order    = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.year} — {self.event[:60]}"


class SiteValue(models.Model):
    settings    = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name="values")
    title       = models.CharField(max_length=100)
    description = models.TextField()
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


# ─────────────────────────────────────────────────────────────────────────────
# TESTIMONIALS
# ─────────────────────────────────────────────────────────────────────────────
class Testimonial(models.Model):
    quote     = models.TextField()
    author    = models.CharField(max_length=100)
    location  = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    order     = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.author} — {self.quote[:60]}"


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────────────────────────────────────
class Category(models.Model):
    name      = models.CharField(max_length=100)
    slug      = models.SlugField(unique=True, blank=True)
    icon      = models.CharField(max_length=10, blank=True, default="")
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering            = ["order"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ─────────────────────────────────────────────────────────────────────────────
# NEWS
# ─────────────────────────────────────────────────────────────────────────────
class News(models.Model):
    title        = models.CharField(max_length=255)
    slug         = models.SlugField(unique=True)
    excerpt      = models.TextField(blank=True, default="",
                                    help_text="1-2 sentence preview shown on the news listing page.")
    content      = models.TextField(help_text="Full article body. You can use HTML for formatting.")
    cover        = models.ImageField(upload_to="news/", blank=True, null=True,
                                     validators=[validate_image_size],
                                     help_text="Upload a cover image (auto-compressed to web size). OR paste a URL below.")
    cover_image  = models.URLField(blank=True, default="",
                                   help_text="External cover image URL (Cloudinary, etc.)")
    author       = models.CharField(max_length=100, default="Campaign Team")
    published_at = models.DateTimeField(null=True, blank=True,
                                        help_text="Set a date/time and flip 'Is published' to go live.")
    is_published = models.BooleanField(default=True)
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ["-published_at", "-created_at"]
        verbose_name_plural = "News"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        _compress_and_save(self, "cover")

    def get_cover_url(self, request=None):
        if self.cover_image:
            return self.cover_image
        if self.cover:
            url = self.cover.url
            return request.build_absolute_uri(url) if request else url
        return None


# ─────────────────────────────────────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────────────────────────────────────
class Project(models.Model):
    title        = models.CharField(max_length=255)
    slug         = models.SlugField(unique=True)
    description  = models.TextField(help_text="Full description of what was done and the impact.")
    cover        = models.ImageField(upload_to="projects/", blank=True, null=True,
                                     validators=[validate_image_size],
                                     help_text="Upload a cover image (auto-compressed). OR paste a URL below.")
    cover_image  = models.URLField(blank=True, default="",
                                   help_text="External cover image URL (Cloudinary, etc.)")
    year         = models.PositiveIntegerField(default=2024,
                                               help_text="Year the project was completed.")
    is_featured  = models.BooleanField(default=False,
                                       help_text="Featured projects are highlighted on the home page.")
    is_published = models.BooleanField(default=True)
    order        = models.PositiveIntegerField(default=0)
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "order"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        _compress_and_save(self, "cover")

    def get_cover_url(self, request=None):
        if self.cover_image:
            return self.cover_image
        if self.cover:
            url = self.cover.url
            return request.build_absolute_uri(url) if request else url
        return None


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image   = models.ImageField(upload_to="projects/", blank=True, null=True,
                                validators=[validate_image_size],
                                help_text="Upload image (auto-compressed). OR paste a URL below.")
    url     = models.URLField(blank=True, default="",
                              help_text="External image URL.")
    caption = models.CharField(max_length=200, blank=True,
                               help_text="Optional caption shown under this image.")
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} — image {self.order}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        _compress_and_save(self, "image")

    def get_url(self, request=None):
        if self.url:
            return self.url
        if self.image:
            url = self.image.url
            return request.build_absolute_uri(url) if request else url
        return None


# ─────────────────────────────────────────────────────────────────────────────
# GALLERY
# ─────────────────────────────────────────────────────────────────────────────
class GalleryImage(models.Model):
    TYPE_CHOICES = [("photo", "Photo"), ("video", "Video")]

    image   = models.ImageField(
        upload_to="gallery/", blank=True, null=True,
        validators=[validate_image_size],
        help_text="Upload a PHOTO file (auto-compressed). For videos, use the URL field below."
    )
    url     = models.URLField(
        blank=True, default="",
        help_text=(
            "Paste an external URL here. "
            "For PHOTOS: Cloudinary/ImgBB link. "
            "For VIDEOS: YouTube link e.g. https://www.youtube.com/watch?v=ABC123"
        )
    )
    caption = models.CharField(max_length=255, blank=True,
                               help_text="Caption shown under the photo/video.")
    type    = models.CharField(max_length=10, choices=TYPE_CHOICES, default="photo",
                               help_text="Select Photo or Video.")
    tag     = models.CharField(max_length=50, default="photos",
                               help_text="Category tag for filtering: e.g. events, projects, community")
    order   = models.PositiveIntegerField(default=0)

    news    = models.ForeignKey("News",    on_delete=models.CASCADE, null=True, blank=True,
                                related_name="gallery",
                                help_text="Optional: link to a news article.")
    project = models.ForeignKey("Project", on_delete=models.CASCADE, null=True, blank=True,
                                related_name="gallery",
                                help_text="Optional: link to a project.")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.caption or f"Gallery item {self.pk}"

    def clean(self):
        super().clean()
        if self.type == "video" and self.image and hasattr(self.image, "file"):
            validate_video_size(self.image)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.type == "photo" and self.image and self.image.name:
            _compress_and_save(self, "image")

    def get_url(self, request=None):
        if self.url:
            return self.url
        if self.image and self.image.name:
            try:
                url = self.image.url
                return request.build_absolute_uri(url) if request else url
            except Exception:
                return None
        return None


# ─────────────────────────────────────────────────────────────────────────────
# CONTACT MESSAGES
# ─────────────────────────────────────────────────────────────────────────────
class ContactMessage(models.Model):
    full_name   = models.CharField(max_length=100)
    email       = models.EmailField()
    subject     = models.CharField(max_length=200)
    message     = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)
    is_read     = models.BooleanField(default=False)

    class Meta:
        ordering = ["-received_at"]

    def __str__(self):
        return f"{self.full_name} — {self.subject}"
