#!/bin/sh

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Make migrations and migrate the database.
echo "Making migrations and migrating the database. (With makemigrations --merge) "
python manage.py makemigrations --noinput --merge
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput


exec "$@"
