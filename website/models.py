from django.db import models
from django.utils.text import slugify


# ─────────────────────────────────────────────
# SITE SETTINGS  (one row — hero + about data)
# ─────────────────────────────────────────────
class SiteSettings(models.Model):
    # Hero fields
    candidate_name  = models.CharField(max_length=100, default="Elphas Shilosio")
    tagline         = models.CharField(max_length=200, default="Building a better Murhanda — together.")
    bio_short       = models.TextField(default="Proven leadership, real projects, and a bold agenda for every resident of Murhanda Ward.")
    photo_url       = models.URLField(blank=True, default="")
    video_url       = models.URLField(blank=True, default="")
    video_title     = models.CharField(max_length=200, blank=True, default="Murhanda Rising — Our Work in Action")

    # About fields
    bio             = models.TextField(blank=True, default="")
    vision          = models.TextField(blank=True, default="")
    commitment      = models.TextField(blank=True, default="")
    about_photo_url = models.URLField(blank=True, default="")

    class Meta:
        verbose_name        = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        # Enforce single row
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


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


# ─────────────────────────────────────────────
# TESTIMONIALS
# ─────────────────────────────────────────────
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


# ─────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────
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


# ─────────────────────────────────────────────
# NEWS
# ─────────────────────────────────────────────
class News(models.Model):
    title        = models.CharField(max_length=255)
    slug         = models.SlugField(unique=True)
    excerpt      = models.TextField(blank=True, default="")
    content      = models.TextField()
    cover_image  = models.URLField(blank=True, default="")
    author       = models.CharField(max_length=100, default="Campaign Team")
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title


# ─────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────
class Project(models.Model):
    title        = models.CharField(max_length=255)
    slug         = models.SlugField(unique=True)
    description  = models.TextField()
    cover_image  = models.URLField(blank=True, default="")
    year         = models.PositiveIntegerField(default=2024)
    is_featured  = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order        = models.PositiveIntegerField(default=0)
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "order"]

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    url     = models.URLField()
    caption = models.CharField(max_length=200, blank=True)
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} — image {self.order}"


# ─────────────────────────────────────────────
# GALLERY  (standalone items, not tied to project/news)
# ─────────────────────────────────────────────
class GalleryImage(models.Model):
    TYPE_CHOICES = [("photo", "Photo"), ("video", "Video")]

    image   = models.ImageField(upload_to="gallery/", blank=True, null=True)
    url     = models.URLField(blank=True, default="")   # external URL alternative to upload
    caption = models.CharField(max_length=255, blank=True)
    type    = models.CharField(max_length=10, choices=TYPE_CHOICES, default="photo")
    tag     = models.CharField(max_length=50, default="photos")
    order   = models.PositiveIntegerField(default=0)

    # Optional links — both nullable so standalone items are allowed
    news    = models.ForeignKey(News,    on_delete=models.CASCADE, null=True, blank=True, related_name="gallery")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, related_name="gallery")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.caption or f"Gallery item {self.pk}"

    def get_url(self, request=None):
        """Return the best available URL for this item."""
        if self.url:
            return self.url
        if self.image and request:
            return request.build_absolute_uri(self.image.url)
        if self.image:
            return self.image.url
        return None


# ─────────────────────────────────────────────
# CONTACT MESSAGES
# ─────────────────────────────────────────────
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
