from .settings import *

# Configuración de la base de datos para testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'test_db.sqlite3',  # Puedes usar ':memory:' para una DB en memoria
    }
}
