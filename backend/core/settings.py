# from pathlib import Path
# from datetime import timedelta
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent.parent

# # Secret key loaded from .env — never hardcode this
# SECRET_KEY = os.getenv('SECRET_KEY')

# # Debug mode — set to False in production
# DEBUG = os.getenv('DEBUG', 'True') == 'True'

# ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

# # ── INSTALLED APPS ────────────────────────────────────────────────────────────
# # Django needs to know about every app and package we are using

# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',

#     # Third party packages
#     'rest_framework',           # Django REST Framework — turns Django into an API
#     'rest_framework_simplejwt', # JWT authentication
#     'corsheaders',              # Allows React to talk to Django

#     # Our app
#     'reviews',
# ]

# # ── MIDDLEWARE ────────────────────────────────────────────────────────────────
# # Middleware runs on every request before it reaches your views
# # corsheaders must be at the very top

# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',  # Must be first
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'core.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'core.wsgi.application'

# # ── DATABASE ──────────────────────────────────────────────────────────────────
# # We use PostgreSQL. Credentials come from the .env file

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('DB_NAME', 'gearup_reviews'),
#         'USER': os.getenv('DB_USER', 'postgres'),
#         'PASSWORD': os.getenv('DB_PASSWORD', ''),
#         'HOST': os.getenv('DB_HOST', 'localhost'),
#         'PORT': os.getenv('DB_PORT', '5432'),
#     }
# }

# # ── AUTHENTICATION ────────────────────────────────────────────────────────────
# # Tell Django to use our custom User model instead of the default one
# # We define this model in reviews/models.py

# AUTH_USER_MODEL = 'reviews.User'

# # ── REST FRAMEWORK ────────────────────────────────────────────────────────────
# # Configure DRF to use JWT tokens for authentication by default

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
#     'DEFAULT_PERMISSION_CLASSES': (
#         'rest_framework.permissions.IsAuthenticated',
#     ),
# }

# # ── JWT SETTINGS ──────────────────────────────────────────────────────────────
# # How long tokens last before expiring

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),   # Token valid for 8 hours
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),    # Refresh token valid for 7 days
#     'ROTATE_REFRESH_TOKENS': True,                  # Issue new refresh token on each refresh
#     'AUTH_HEADER_TYPES': ('Bearer',),               # React sends: Authorization: Bearer <token>
# }

# # ── CORS SETTINGS ─────────────────────────────────────────────────────────────
# # Allow React running on port 5173 to make requests to Django on port 8000

# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:5173',
#     'http://127.0.0.1:5173',
# ]

# CORS_ALLOW_CREDENTIALS = True

# # ── PASSWORD VALIDATION ───────────────────────────────────────────────────────

# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# # ── INTERNATIONALISATION ──────────────────────────────────────────────────────

# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'Africa/Accra'
# USE_I18N = True
# USE_TZ = True

# # ── STATIC FILES ──────────────────────────────────────────────────────────────

# STATIC_URL = 'static/'
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from pathlib import Path
from datetime import timedelta
from urllib.parse import urlparse, parse_qs, unquote
import os
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured

# Load environment variables from the .env file (used on your own computer).
# On a live server the hosting platform provides these values instead.
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default=''):
    """Reads a comma-separated environment variable into a clean list.
    Example:  ALLOWED_HOSTS=a.com, b.com   ->   ['a.com', 'b.com']"""
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


# ── DEBUG ─────────────────────────────────────────────────────────────────────
# Defaults to False so a forgotten setting can never expose error pages on a
# live site. For local development put  DEBUG=True  in your backend/.env file.
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# ── SECRET KEY ────────────────────────────────────────────────────────────────
# Never hardcode this. The fallback below only works while DEBUG is True.
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'insecure-development-key-only'
    else:
        raise ImproperlyConfigured('The SECRET_KEY environment variable is not set.')

ALLOWED_HOSTS = env_list('ALLOWED_HOSTS', 'localhost,127.0.0.1')

# ── INSTALLED APPS ────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party packages
    'rest_framework',           # Django REST Framework — turns Django into an API
    'rest_framework_simplejwt', # JWT authentication
    'corsheaders',              # Allows React to talk to Django

    # Our app
    'reviews',
]

# ── MIDDLEWARE ────────────────────────────────────────────────────────────────
# Middleware runs on every request before it reaches your views.
# corsheaders must be at the very top. WhiteNoise must come right after
# SecurityMiddleware: it serves the admin pages' CSS/JS on the live server.

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ── DATABASE ──────────────────────────────────────────────────────────────────
# Live server: the host gives us ONE address in DATABASE_URL, for example
#   postgres://user:password@host:5432/dbname
# Your computer: no DATABASE_URL, so the separate DB_* values from .env are used.

def database_from_url(url):
    parsed = urlparse(url)
    if parsed.scheme in ('postgres', 'postgresql'):
        config = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': parsed.path.lstrip('/'),
            'USER': unquote(parsed.username or ''),
            'PASSWORD': unquote(parsed.password or ''),
            'HOST': parsed.hostname or '',
            'PORT': str(parsed.port or 5432),
            'CONN_MAX_AGE': 60,   # reuse connections instead of reconnecting every request
        }
        options = {key: values[0] for key, values in parse_qs(parsed.query).items()}
        if options:               # e.g. ?sslmode=require
            config['OPTIONS'] = options
        return config
    if parsed.scheme == 'sqlite':
        return {'ENGINE': 'django.db.backends.sqlite3', 'NAME': parsed.path.lstrip('/') or ':memory:'}
    raise ImproperlyConfigured('DATABASE_URL must start with postgres:// (or sqlite:// for tests).')


if os.getenv('DATABASE_URL'):
    DATABASES = {'default': database_from_url(os.environ['DATABASE_URL'])}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'gearup_reviews'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }

# ── AUTHENTICATION ────────────────────────────────────────────────────────────
# Tell Django to use our custom User model instead of the default one
AUTH_USER_MODEL = 'reviews.User'

# ── REST FRAMEWORK ────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
if not DEBUG:
    # On the live site only return JSON (no browsable HTML API page)
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = ('rest_framework.renderers.JSONRenderer',)

# ── JWT SETTINGS ──────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),   # Token valid for 8 hours
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),    # Refresh token valid for 7 days
    'ROTATE_REFRESH_TOKENS': True,                  # Issue new refresh token on each refresh
    'AUTH_HEADER_TYPES': ('Bearer',),               # React sends: Authorization: Bearer <token>
}

# ── CORS / CSRF ───────────────────────────────────────────────────────────────
# Which website addresses may call this API. On the live server set
#   CORS_ALLOWED_ORIGINS=https://your-frontend-address
# (no trailing slash). Locally the React dev server is allowed by default.
CORS_ALLOWED_ORIGINS = env_list(
    'CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173'
)
CORS_ALLOW_CREDENTIALS = True

# Needed so the Django admin login works over https on the live server, e.g.
#   CSRF_TRUSTED_ORIGINS=https://your-backend-address
CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS')

# ── HTTPS / SECURITY (live server only) ───────────────────────────────────────
if not DEBUG:
    # The host's load balancer handles https and tells Django via this header
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True') == 'True'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # Tells browsers to only use https for this site. Starts at 1 hour; once
    # everything works raise it (for example 31536000 = one year).
    SECURE_HSTS_SECONDS = int(os.getenv('SECURE_HSTS_SECONDS', '3600'))

# ── PASSWORD VALIDATION ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── INTERNATIONALISATION ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Accra'
USE_I18N = True
USE_TZ = True

# ── STATIC FILES ──────────────────────────────────────────────────────────────
# `collectstatic` copies the admin pages' CSS/JS into STATIC_ROOT and WhiteNoise
# serves them. Locally (DEBUG=True) Django serves them itself, as before.
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {
        'BACKEND': (
            'django.contrib.staticfiles.storage.StaticFilesStorage' if DEBUG
            else 'whitenoise.storage.CompressedManifestStaticFilesStorage'
        ),
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── LOGGING ───────────────────────────────────────────────────────────────────
# Send logs (including error tracebacks) to the console so they appear in the
# hosting platform's "Logs" page. Without this, live errors are invisible.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'INFO'},
}