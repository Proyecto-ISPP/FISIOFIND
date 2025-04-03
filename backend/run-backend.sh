#!/bin/sh

python ./fisio_find/manage.py makemigrations

python ./fisio_find/manage.py migrate

python ./fisio_find/manage.py runserver
