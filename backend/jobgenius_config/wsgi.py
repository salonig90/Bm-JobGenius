"""
WSGI config for jobgenius_config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
from dotenv import load_dotenv

from django.core.wsgi import get_wsgi_application

load_dotenv(override=True) # Load variables from .env, override shell env
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jobgenius_config.settings")

application = get_wsgi_application()
