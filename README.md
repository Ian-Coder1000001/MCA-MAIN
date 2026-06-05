# MCA Django Website

A modern Django website project with:
- Frontend templates
- Reusable components
- REST API support
- Static and media file handling
- Admin dashboard
- SEO-friendly structure

---

# Project Structure

```bash
MCA-main/
│── manage.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── core/
│   ├── migrations/
│   ├── templates/
│   │   ├── core/
│   │   │   ├── base.html
│   │   │   ├── home.html
│   │   │   ├── about.html
│   │   │   ├── projects.html
│   │   │   ├── news.html
│   │   │   ├── news_detail.html
│   │   │   ├── gallery.html
│   │   │   └── contact.html
│   │   │
│   │   └── components/
│   │       ├── navbar.html
│   │       └── footer.html
│   │
│   ├── static/
│   │   └── core/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   │
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── api/
│   ├── urls.py
│   └── views.py
│
├── media/
│
└── requirements.txt

**Installation**
**Clone Repository**

git clone https://github.com/yourusername/mca-django.git
cd MCA-main

**Create Virtual Environment**
**Windows**

python -m venv venv
venv\Scripts\activate

**Mac/Linux**
python3 -m venv venv
source venv/bin/activate

**Install Dependencies**
pip install -r requirements.txt

**Or manually:**

pip install django pillow djangorestframework
**Run Migrations**

python manage.py makemigrations
python manage.py migrate

**Create Admin User**

python manage.py createsuperuser

**Run Server**

python manage.py runserver

**Open:**

http://127.0.0.1:8000/

Admin:

http://127.0.0.1:8000/admin/
Static Files

**Configured in:**

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'core/static')
]
Media Files

**Configured in:**

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
API Example

**Endpoint:**

/api/

Response:

{
  "message": "API working"
}
Technologies Used
Python
Django
Django REST Framework
HTML5
CSS3
JavaScript
Deployment

**Can be deployed on:**

Vercel
Render
Railway
PythonAnywhere
VPS servers
# MCA-MAIN
