from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

from .models import (
    SiteSettings, Testimonial, Category,
    News, Project, GalleryImage, ContactMessage,
)
from .serializers import (
    HeroSerializer, AboutSerializer,
    TestimonialSerializer, CategorySerializer,
    NewsSerializer, NewsListSerializer,
    ProjectSerializer, GallerySerializer,
    ContactMessageSerializer,
)


# ─────────────────────────────────────────────
# ROOT
# ─────────────────────────────────────────────
def api_root(request):
    return JsonResponse({
        "status": "Shilosio MCA API running",
        "endpoints": {
            "hero":         "/api/hero/",
            "about":        "/api/about/",
            "categories":   "/api/categories/",
            "projects":     "/api/projects/",
            "news":         "/api/news/",
            "gallery":      "/api/gallery/",
            "testimonials": "/api/testimonials/",
            "contact":      "/api/contact/",
            "admin":        "/admin/",
        }
    })


# ─────────────────────────────────────────────
# HERO
# ─────────────────────────────────────────────
@api_view(["GET"])
def hero(request):
    settings = SiteSettings.get()
    return Response(HeroSerializer(settings).data)


# ─────────────────────────────────────────────
# ABOUT
# ─────────────────────────────────────────────
@api_view(["GET"])
def about(request):
    settings = SiteSettings.get()
    return Response(AboutSerializer(settings).data)


# ─────────────────────────────────────────────
# CATEGORIES
# ─────────────────────────────────────────────
@api_view(["GET"])
def category_list(request):
    categories = Category.objects.filter(is_active=True)
    return Response(CategorySerializer(categories, many=True).data)


# ─────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────
@api_view(["GET"])
def project_list(request):
    qs = Project.objects.filter(is_published=True).select_related("category").prefetch_related("images", "gallery")
    category_slug = request.query_params.get("category")
    if category_slug:
        qs = qs.filter(category__slug=category_slug)
    return Response(ProjectSerializer(qs, many=True, context={"request": request}).data)


@api_view(["GET"])
def project_detail(request, slug):
    try:
        project = Project.objects.select_related("category").prefetch_related("images", "gallery").get(slug=slug, is_published=True)
    except Project.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(ProjectSerializer(project, context={"request": request}).data)


# ─────────────────────────────────────────────
# NEWS
# ─────────────────────────────────────────────
@api_view(["GET"])
def news_list(request):
    qs = News.objects.filter(is_published=True).select_related("category").prefetch_related("gallery")
    limit = request.query_params.get("limit")
    if limit:
        try:
            qs = qs[:int(limit)]
        except ValueError:
            pass
    return Response(NewsListSerializer(qs, many=True, context={"request": request}).data)


@api_view(["GET"])
def news_detail(request, slug):
    try:
        article = News.objects.prefetch_related("gallery").get(slug=slug, is_published=True)
    except News.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(NewsSerializer(article, context={"request": request}).data)


# ─────────────────────────────────────────────
# GALLERY
# ─────────────────────────────────────────────
@api_view(["GET"])
def gallery_list(request):
    gallery = GalleryImage.objects.all()
    return Response(GallerySerializer(gallery, many=True, context={"request": request}).data)


# ─────────────────────────────────────────────
# TESTIMONIALS
# ─────────────────────────────────────────────
@api_view(["GET"])
def testimonial_list(request):
    testimonials = Testimonial.objects.filter(is_active=True)
    return Response(TestimonialSerializer(testimonials, many=True).data)


# ─────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────
@api_view(["POST"])
def contact(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"success": True, "message": "Your message has been received. We will get back to you within 2 business days."},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"success": False, "message": "Please check the form and try again.", "errors": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )
