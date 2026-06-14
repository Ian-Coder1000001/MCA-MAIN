from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import (
    SiteSettings, HeroStat, TimelineEntry, SiteValue,
    Testimonial, Category, News, Project, ProjectImage,
    GalleryImage, ContactMessage,
)


def image_preview(url, size=60):
    if url:
        return format_html(
            '<img src="{}" style="height:{}px;width:auto;border-radius:4px;'
            'object-fit:cover;border:1px solid #ddd;" />',
            url, size,
        )
    return "—"


# ─────────────────────────────────────────────────────────────────────────────
# SITE SETTINGS
# ─────────────────────────────────────────────────────────────────────────────

class HeroStatInline(admin.TabularInline):
    model        = HeroStat
    extra        = 4
    fields       = ["label", "value", "order"]
    verbose_name = "Stat (shown in hero stats bar)"
    verbose_name_plural = "Hero stats (e.g. '18+ Projects', '5K+ Residents')"

class TimelineEntryInline(admin.TabularInline):
    model        = TimelineEntry
    extra        = 2
    fields       = ["year", "event", "order"]
    verbose_name = "Timeline entry"
    verbose_name_plural = "Timeline entries (shown on About page)"

class SiteValueInline(admin.TabularInline):
    model        = SiteValue
    extra        = 2
    fields       = ["title", "description", "order"]
    verbose_name = "Core value"
    verbose_name_plural = "Core values (shown on About page)"


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [HeroStatInline, TimelineEntryInline, SiteValueInline]

    fieldsets = (
        # ── Hero section ──────────────────────────────────────────────────
        ("HOME PAGE — Candidate info", {
            "description": (
                "<strong>This controls the big hero banner on the home page.</strong><br>"
                "Fill in all fields. For the candidate photo: upload a file OR paste "
                "a Cloudinary/external URL — whichever you fill in will be used."
            ),
            "fields": (
                "candidate_name",
                "tagline",
                "bio_short",
                "photo",
                "photo_url",
            ),
        }),
        # ── Video ─────────────────────────────────────────────────────────
        ("HOME PAGE — Campaign video", {
            "description": (
                "<strong>Paste a YouTube link</strong> e.g. "
                "<code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code><br>"
                "You can also paste a youtu.be short link or the full &lt;iframe&gt; "
                "embed code from YouTube's Share button. "
                "The video title appears next to the player."
            ),
            "fields": ("video_url", "video_title"),
        }),
        # ── About page ────────────────────────────────────────────────────
        ("ABOUT PAGE — Biography & vision", {
            "description": (
                "<strong>This controls the About page content.</strong><br>"
                "For the photo: upload a file OR paste an external URL."
            ),
            "fields": (
                "bio",
                "vision",
                "commitment",
                "about_photo",
                "about_photo_url",
            ),
            "classes": ("collapse",),
        }),
    )

    def has_add_permission(self, request):
        # Auto-create on first load — prevent manual Add
        SiteSettings.get()
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # Redirect straight to the edit page (there's only 1 row)
        obj = SiteSettings.get()
        from django.http import HttpResponseRedirect
        return HttpResponseRedirect(
            reverse("admin:website_sitesettings_change", args=[obj.pk])
        )


# ─────────────────────────────────────────────────────────────────────────────
# TESTIMONIALS
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ["author", "location", "short_quote", "is_active", "order"]
    list_editable = ["is_active", "order"]
    list_filter   = ["is_active"]
    fields        = ["quote", "author", "location", "is_active", "order"]

    @admin.display(description="Quote preview")
    def short_quote(self, obj):
        return (obj.quote[:80] + "…") if len(obj.quote) > 80 else obj.quote


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display    = ["name", "slug", "order", "is_active"]
    list_editable   = ["order", "is_active"]
    readonly_fields = ["slug"]
    fields          = ["name", "slug", "order", "is_active"]


# ─────────────────────────────────────────────────────────────────────────────
# GALLERY IMAGE
# ─────────────────────────────────────────────────────────────────────────────

class GalleryImageInline(admin.TabularInline):
    model        = GalleryImage
    extra        = 1
    fields       = ["image", "url", "caption", "type", "tag", "order"]
    verbose_name = "Gallery photo / video"


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display  = ["preview", "caption", "type", "tag", "order", "has_media"]
    list_filter   = ["type", "tag"]
    list_editable = ["order"]

    fieldsets = (
        ("What type of media is this?", {
            "fields": ("type",),
            "description": "Select <strong>Photo</strong> or <strong>Video</strong> first.",
        }),
        ("Media — upload OR paste a URL (only one needed)", {
            "description": (
                "<strong>For photos:</strong> Upload a file — it will be auto-compressed to web size. "
                "OR paste a Cloudinary/ImgBB URL below.<br><br>"
                "<strong>For videos:</strong> Use the URL field only. "
                "Paste a YouTube link like <code>https://www.youtube.com/watch?v=ABC123</code>. "
                "Do NOT upload a video file — use YouTube/Vimeo instead."
            ),
            "fields": ("image", "url"),
        }),
        ("Details", {
            "fields": ("caption", "tag", "order"),
        }),
        ("Link to a project or news article (optional)", {
            "fields": ("project", "news"),
            "classes": ("collapse",),
            "description": "Only fill these in if this image belongs to a specific project or article.",
        }),
    )

    @admin.display(description="Preview")
    def preview(self, obj):
        url = obj.get_url()
        if url and obj.type == "photo":
            return image_preview(url, 50)
        if obj.type == "video":
            return format_html('<span style="color:#666;">▶ Video</span>')
        return "—"

    @admin.display(description="Has media?", boolean=True)
    def has_media(self, obj):
        return bool(obj.get_url())


# ─────────────────────────────────────────────────────────────────────────────
# NEWS
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display        = ["title", "author", "published_at", "is_published", "cover_preview"]
    list_filter         = ["is_published", "category"]
    list_editable       = ["is_published"]
    prepopulated_fields = {"slug": ("title",)}
    inlines             = [GalleryImageInline]

    fieldsets = (
        ("Article content", {
            "description": (
                "Write the article here. "
                "<strong>Excerpt</strong> is the 1-2 sentence preview shown on the news listing page. "
                "<strong>Content</strong> is the full article body (HTML is supported)."
            ),
            "fields": ("title", "excerpt", "content"),
        }),
        ("Cover image — upload OR paste a URL (only one needed)", {
            "description": (
                "Upload an image file (auto-compressed) OR paste an external URL. "
                "Only fill in one of the two fields."
            ),
            "fields": ("cover", "cover_image"),
        }),
        ("Publishing settings", {
            "description": "Slug is auto-filled from the title. Set the date and toggle Is Published when ready.",
            "fields": ("slug", "author", "category", "is_published", "published_at"),
        }),
    )

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        return image_preview(obj.get_cover_url(), 40)


# ─────────────────────────────────────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────────────────────────────────────

class ProjectImageInline(admin.TabularInline):
    model        = ProjectImage
    extra        = 2
    fields       = ["image", "url", "caption", "order"]
    verbose_name = "Additional project image"
    verbose_name_plural = "Additional project images (shown in the project detail modal)"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display        = ["title", "category", "year", "is_featured", "is_published", "cover_preview"]
    list_filter         = ["is_published", "is_featured", "category", "year"]
    list_editable       = ["is_featured", "is_published"]
    prepopulated_fields = {"slug": ("title",)}
    inlines             = [ProjectImageInline]

    fieldsets = (
        ("Project details", {
            "description": "Fill in what the project is, which sector it belongs to, and when it was completed.",
            "fields": ("title", "category", "year", "description"),
        }),
        ("Cover image — upload OR paste a URL (only one needed)", {
            "description": (
                "Upload an image file (auto-compressed) OR paste an external URL. "
                "Only fill in one of the two fields."
            ),
            "fields": ("cover", "cover_image"),
        }),
        ("Publishing settings", {
            "description": "Slug is auto-filled. Toggle Is Published to show/hide. Is Featured highlights it on the home page.",
            "fields": ("slug", "is_published", "is_featured", "order"),
            "classes": ("collapse",),
        }),
    )

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        return image_preview(obj.get_cover_url(), 40)


# ─────────────────────────────────────────────────────────────────────────────
# CONTACT MESSAGES — read-only inbox
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display    = ["full_name", "email", "subject", "received_at", "is_read"]
    list_filter     = ["is_read"]
    list_editable   = ["is_read"]
    readonly_fields = ["full_name", "email", "subject", "message", "received_at"]
    fields          = ["full_name", "email", "subject", "message", "received_at", "is_read"]

    def has_add_permission(self, request):
        return False
