from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        # Last migration that exists in the project
        ("website", "0006_alter_galleryimage_news_alter_galleryimage_project"),
    ]

    operations = [

        # ── SiteSettings ──────────────────────────────────────────────────
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                ("id",              models.AutoField(primary_key=True, serialize=False)),
                ("candidate_name",  models.CharField(default="Elphas Shilosio", max_length=100)),
                ("tagline",         models.CharField(default="Building a better Murhanda — together.", max_length=200)),
                ("bio_short",       models.TextField(default="Proven leadership, real projects, and a bold agenda for every resident of Murhanda Ward.")),
                ("photo_url",       models.URLField(blank=True, default="")),
                ("video_url",       models.URLField(blank=True, default="")),
                ("video_title",     models.CharField(blank=True, default="Murhanda Rising — Our Work in Action", max_length=200)),
                ("bio",             models.TextField(blank=True, default="")),
                ("vision",          models.TextField(blank=True, default="")),
                ("commitment",      models.TextField(blank=True, default="")),
                ("about_photo_url", models.URLField(blank=True, default="")),
            ],
            options={"verbose_name": "Site Settings", "verbose_name_plural": "Site Settings"},
        ),

        migrations.CreateModel(
            name="HeroStat",
            fields=[
                ("id",       models.BigAutoField(primary_key=True, serialize=False)),
                ("label",    models.CharField(max_length=100)),
                ("value",    models.CharField(max_length=50)),
                ("order",    models.PositiveIntegerField(default=0)),
                ("settings", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="stats", to="website.sitesettings")),
            ],
            options={"ordering": ["order"]},
        ),

        migrations.CreateModel(
            name="TimelineEntry",
            fields=[
                ("id",       models.BigAutoField(primary_key=True, serialize=False)),
                ("year",     models.CharField(max_length=10)),
                ("event",    models.TextField()),
                ("order",    models.PositiveIntegerField(default=0)),
                ("settings", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="timeline", to="website.sitesettings")),
            ],
            options={"ordering": ["order"]},
        ),

        migrations.CreateModel(
            name="SiteValue",
            fields=[
                ("id",          models.BigAutoField(primary_key=True, serialize=False)),
                ("title",       models.CharField(max_length=100)),
                ("description", models.TextField()),
                ("order",       models.PositiveIntegerField(default=0)),
                ("settings",    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="values", to="website.sitesettings")),
            ],
            options={"ordering": ["order"]},
        ),

        # ── Testimonial ───────────────────────────────────────────────────
        migrations.CreateModel(
            name="Testimonial",
            fields=[
                ("id",        models.BigAutoField(primary_key=True, serialize=False)),
                ("quote",     models.TextField()),
                ("author",    models.CharField(max_length=100)),
                ("location",  models.CharField(max_length=100)),
                ("is_active", models.BooleanField(default=True)),
                ("order",     models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["order"]},
        ),

        # ── ContactMessage ────────────────────────────────────────────────
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id",          models.BigAutoField(primary_key=True, serialize=False)),
                ("full_name",   models.CharField(max_length=100)),
                ("email",       models.EmailField(max_length=254)),
                ("subject",     models.CharField(max_length=200)),
                ("message",     models.TextField()),
                ("received_at", models.DateTimeField(auto_now_add=True)),
                ("is_read",     models.BooleanField(default=False)),
            ],
            options={"ordering": ["-received_at"]},
        ),

        # ── ProjectImage ──────────────────────────────────────────────────
        migrations.CreateModel(
            name="ProjectImage",
            fields=[
                ("id",      models.BigAutoField(primary_key=True, serialize=False)),
                ("url",     models.URLField()),
                ("caption", models.CharField(blank=True, max_length=200)),
                ("order",   models.PositiveIntegerField(default=0)),
                ("project", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="images", to="website.project")),
            ],
            options={"ordering": ["order"]},
        ),

        # ── Category — new fields ──────────────────────────────────────────
        migrations.AddField(
            model_name="category",
            name="slug",
            field=models.SlugField(blank=True, unique=True, default=""),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="category",
            name="icon",
            field=models.CharField(blank=True, default="", max_length=10),
        ),
        migrations.AddField(
            model_name="category",
            name="order",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="category",
            name="is_active",
            field=models.BooleanField(default=True),
        ),

        # ── News — new fields ─────────────────────────────────────────────
        migrations.AddField(
            model_name="news",
            name="excerpt",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="news",
            name="cover_image",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="news",
            name="author",
            field=models.CharField(default="Campaign Team", max_length=100),
        ),
        migrations.AddField(
            model_name="news",
            name="published_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="news",
            name="is_published",
            field=models.BooleanField(default=True),
        ),

        # ── Project — new fields ──────────────────────────────────────────
        migrations.AddField(
            model_name="project",
            name="cover_image",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="project",
            name="year",
            field=models.PositiveIntegerField(default=2024),
        ),
        migrations.AddField(
            model_name="project",
            name="is_featured",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="project",
            name="is_published",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="project",
            name="order",
            field=models.PositiveIntegerField(default=0),
        ),

        # ── GalleryImage — new fields ─────────────────────────────────────
        migrations.AddField(
            model_name="galleryimage",
            name="url",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="type",
            field=models.CharField(
                choices=[("photo", "Photo"), ("video", "Video")],
                default="photo",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="tag",
            field=models.CharField(default="photos", max_length=50),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="order",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
