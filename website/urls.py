from django.urls import path
from . import views

urlpatterns = [
    # Root
    path("",                          views.api_root),

    # Hero & About
    path("api/hero/",                 views.hero),
    path("api/about/",                views.about),

    # Categories
    path("api/categories/",           views.category_list),

    # Projects
    path("api/projects/",             views.project_list),
    path("api/projects/<slug:slug>/", views.project_detail),

    # News
    path("api/news/",                 views.news_list),
    path("api/news/<slug:slug>/",     views.news_detail),

    # Gallery
    path("api/gallery/",              views.gallery_list),

    # Testimonials
    path("api/testimonials/",         views.testimonial_list),

    # Contact
    path("api/contact/",              views.contact),
]
