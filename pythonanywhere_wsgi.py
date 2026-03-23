import sys
import os

# Add the Django project directory to the path
project_home = '/home/sikerino/gymrats/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ['DJANGO_SETTINGS_MODULE'] = 'gymrats.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
