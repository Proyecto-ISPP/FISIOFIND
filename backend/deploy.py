import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fisio_find.settings')
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    
if __name__ == '__main__':
    main()