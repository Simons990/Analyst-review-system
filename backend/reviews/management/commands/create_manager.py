"""
Create a manager account.

On your computer (asks you to type the password):
    python manage.py create_manager manager@gearupafrica.com "Full Name" --admin

On a live server with no terminal access (reads three environment variables):
    MANAGER_EMAIL, MANAGER_NAME, MANAGER_PASSWORD
    python manage.py create_manager --from-env --admin

It is safe to run more than once: if the email already exists it does nothing.
--admin also gives access to the Django admin site (/admin).
"""
import os
from getpass import getpass

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError

from reviews.models import User


class Command(BaseCommand):
    help = 'Create a manager account (use --admin for Django admin access).'

    def add_arguments(self, parser):
        parser.add_argument('email', nargs='?')
        parser.add_argument('name', nargs='?')
        parser.add_argument('--admin', action='store_true',
                            help='Also allow signing in to the Django admin site')
        parser.add_argument('--from-env', action='store_true',
                            help='Read MANAGER_EMAIL, MANAGER_NAME and MANAGER_PASSWORD from the environment')

    def handle(self, *args, **options):
        if options['from_env']:
            email = os.getenv('MANAGER_EMAIL', '').strip().lower()
            name = os.getenv('MANAGER_NAME', '').strip()
            password = os.getenv('MANAGER_PASSWORD', '')
            if not (email and name and password):
                # Not an error: after the first deploy you remove MANAGER_PASSWORD,
                # and this command should then quietly do nothing.
                self.stdout.write('MANAGER_EMAIL / MANAGER_NAME / MANAGER_PASSWORD not all set, skipping.')
                return
        else:
            if not options['email'] or not options['name']:
                raise CommandError('Usage: create_manager EMAIL "FULL NAME" [--admin]')
            email = options['email'].strip().lower()
            name = options['name'].strip()
            password = getpass('Password: ')
            if password != getpass('Password (again): '):
                raise CommandError('The two passwords do not match.')

        if User.objects.filter(email__iexact=email).exists():
            self.stdout.write(f'{email} already exists, nothing to do.')
            return

        user = User(
            email=email, name=name, role='manager', is_active=True,
            is_staff=options['admin'], is_superuser=options['admin'],
        )
        try:
            validate_password(password, user=user)
        except ValidationError as error:
            raise CommandError(' '.join(error.messages))

        user.set_password(password)
        user.save()
        self.stdout.write(self.style.SUCCESS(
            f'Created manager {name} <{email}>' + (' with admin access.' if options['admin'] else '.')
        ))
        