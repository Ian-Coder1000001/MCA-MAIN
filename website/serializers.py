from rest_framework import serializers
from .models import (
    SiteSettings, HeroStat, TimelineEntry, SiteValue,
    Testimonial, Category, News, Project, ProjectImage,
    GalleryImage, ContactMessage,
)


def null_if_empty(value):
    """Return None instead of empty string for URL/image fields."""
    if not value or str(value).strip() == "":
        return None
    return value


# ─────────────────────────────────────────────
# SITE SETTINGS — Hero
# ─────────────────────────────────────────────
class HeroStatSerializer(serializers.ModelSerializer):
    class Meta:
        model  = HeroStat
        fields = ["label", "value"]


class HeroSerializer(serializers.ModelSerializer):
    stats     = HeroStatSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model  = SiteSettings
        fields = [
            "candidate_name", "tagline", "bio_short",
            "photo_url", "video_url", "video_title", "stats",
        ]

    def get_photo_url(self, obj):
        return null_if_empty(obj.photo_url)

    def get_video_url(self, obj):
        return null_if_empty(obj.video_url)


# ─────────────────────────────────────────────
# SITE SETTINGS — About
# ─────────────────────────────────────────────
class TimelineEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model  = TimelineEntry
        fields = ["year", "event"]


class SiteValueSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SiteValue
        fields = ["title", "description"]


class AboutSerializer(serializers.ModelSerializer):
    timeline  = TimelineEntrySerializer(many=True, read_only=True)
    values    = SiteValueSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = SiteSettings
        fields = ["bio", "vision", "commitment", "photo_url", "timeline", "values"]

    def get_photo_url(self, obj):
        return null_if_empty(obj.about_photo_url)


# ─────────────────────────────────────────────
# TESTIMONIAL
# ─────────────────────────────────────────────
class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Testimonial
        fields = ["id", "quote", "author", "location"]


# ─────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────
class CategorySerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ["id", "name", "slug", "icon", "project_count", "order"]

    def get_project_count(self, obj):
        return obj.project_set.filter(is_published=True).count()


# ─────────────────────────────────────────────
# GALLERY
# ─────────────────────────────────────────────
class GallerySerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model  = GalleryImage
        fields = ["id", "url", "caption", "type", "tag"]

    def get_url(self, obj):
        request = self.context.get("request")
        raw = obj.get_url(request)
        return null_if_empty(raw)


# ─────────────────────────────────────────────
# PROJECT IMAGE
# ─────────────────────────────────────────────
class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProjectImage
        fields = ["url", "caption"]


# ─────────────────────────────────────────────
# PROJECT
# ─────────────────────────────────────────────
class ProjectSerializer(serializers.ModelSerializer):
    category    = CategorySerializer(read_only=True)
    images      = ProjectImageSerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = [
            "id", "title", "slug", "description",
            "year", "cover_image", "images",
            "category", "is_featured",
        ]

    def get_cover_image(self, obj):
        return null_if_empty(obj.cover_image)


# ─────────────────────────────────────────────
# NEWS
# ─────────────────────────────────────────────
class NewsListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views — omits full content and gallery."""
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model  = News
        fields = ["id", "title", "slug", "excerpt", "cover_image", "published_at", "author"]

    def get_cover_image(self, obj):
        return null_if_empty(obj.cover_image)


class NewsSerializer(serializers.ModelSerializer):
    gallery     = GallerySerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()
    # Expose content also as "body" so frontend can read either field
    body        = serializers.CharField(source="content", read_only=True)

    class Meta:
        model  = News
        fields = [
            "id", "title", "slug", "excerpt", "content", "body",
            "cover_image", "published_at", "author", "gallery",
        ]

    def get_cover_image(self, obj):
        return null_if_empty(obj.cover_image)


# ─────────────────────────────────────────────
# CONTACT MESSAGE
# ─────────────────────────────────────────────
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactMessage
        fields = ["full_name", "email", "subject", "message"]
