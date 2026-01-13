#!/usr/bin/env bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
