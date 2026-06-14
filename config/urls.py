from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("",       include("website.urls")),
]

# Serve media files in development AND production
# (On Render free tier there's no persistent disk, so use external URLs
#  via Cloudinary/YouTube. But this keeps it working locally.)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Fallback for production where DEBUG=False
if not settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
