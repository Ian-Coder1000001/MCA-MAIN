from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0007_complete_schema"),
    ]

    operations = [
        # SiteSettings — add upload fields
        migrations.AddField(
            model_name="sitesettings",
            name="photo",
            field=models.ImageField(blank=True, null=True, upload_to="site/"),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="about_photo",
            field=models.ImageField(blank=True, null=True, upload_to="site/"),
        ),

        # News — add upload field
        migrations.AddField(
            model_name="news",
            name="cover",
            field=models.ImageField(blank=True, null=True, upload_to="news/",
                                    help_text="Upload an image file"),
        ),

        # Project — add upload field
        migrations.AddField(
            model_name="project",
            name="cover",
            field=models.ImageField(blank=True, null=True, upload_to="projects/",
                                    help_text="Upload an image file"),
        ),

        # ProjectImage — add upload field
        migrations.AddField(
            model_name="projectimage",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="projects/",
                                    help_text="Upload an image file"),
        ),
    ]
