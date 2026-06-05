from django.contrib import admin
from .models import (
    SiteSettings, HeroStat, TimelineEntry, SiteValue,
    Testimonial, Category, News, Project, ProjectImage,
    GalleryImage, ContactMessage,
)


# ─────────────────────────────────────────────
# SITE SETTINGS
# ─────────────────────────────────────────────
class HeroStatInline(admin.TabularInline):
    model  = HeroStat
    extra  = 1
    fields = ["label", "value", "order"]


class TimelineEntryInline(admin.TabularInline):
    model  = TimelineEntry
    extra  = 1
    fields = ["year", "event", "order"]


class SiteValueInline(admin.TabularInline):
    model  = SiteValue
    extra  = 1
    fields = ["title", "description", "order"]


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [HeroStatInline, TimelineEntryInline, SiteValueInline]
    fieldsets = (
        ("Hero section", {
            "fields": ("candidate_name", "tagline", "bio_short", "photo_url", "video_url", "video_title"),
        }),
        ("About page", {
            "fields": ("bio", "vision", "commitment", "about_photo_url"),
        }),
    )

    def has_add_permission(self, request):
        # Only one row allowed
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


# ─────────────────────────────────────────────
# TESTIMONIALS
# ─────────────────────────────────────────────
@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ["author", "location", "is_active", "order"]
    list_editable = ["is_active", "order"]
    list_filter   = ["is_active"]


# ─────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ["name", "slug", "icon", "order", "is_active"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("name",)}


# ─────────────────────────────────────────────
# GALLERY (standalone)
# ─────────────────────────────────────────────
class GalleryImageInline(admin.TabularInline):
    model  = GalleryImage
    extra  = 1
    fields = ["image", "url", "caption", "type", "tag", "order"]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ["caption", "type", "tag", "order", "news", "project"]
    list_filter  = ["type", "tag"]
    list_editable = ["order"]


# ─────────────────────────────────────────────
# NEWS
# ─────────────────────────────────────────────
@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display        = ["title", "author", "published_at", "is_published", "category"]
    list_filter         = ["is_published", "category"]
    list_editable       = ["is_published"]
    prepopulated_fields = {"slug": ("title",)}
    inlines             = [GalleryImageInline]
    fieldsets = (
        (None, {
            "fields": ("title", "slug", "category", "author", "is_published", "published_at"),
        }),
        ("Content", {
            "fields": ("excerpt", "content", "cover_image"),
        }),
    )


# ─────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────
class ProjectImageInline(admin.TabularInline):
    model  = ProjectImage
    extra  = 1
    fields = ["url", "caption", "order"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display        = ["title", "category", "year", "is_featured", "is_published", "order"]
    list_filter         = ["is_published", "is_featured", "category", "year"]
    list_editable       = ["is_featured", "is_published", "order"]
    prepopulated_fields = {"slug": ("title",)}
    inlines             = [ProjectImageInline, GalleryImageInline]
    fieldsets = (
        (None, {
            "fields": ("title", "slug", "category", "year", "is_featured", "is_published", "order"),
        }),
        ("Content", {
            "fields": ("description", "cover_image"),
        }),
    )


# ─────────────────────────────────────────────
# CONTACT MESSAGES
# ─────────────────────────────────────────────
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display  = ["full_name", "email", "subject", "received_at", "is_read"]
    list_filter   = ["is_read"]
    list_editable = ["is_read"]
    readonly_fields = ["full_name", "email", "subject", "message", "received_at"]

    def has_add_permission(self, request):
        return False  # Messages come in via the API only
