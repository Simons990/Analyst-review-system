"""
Pre-register an analyst. They set their own password the first time they sign in.

Usage (from the backend folder, with the venv active):

    python manage.py add_analyst EMAIL "FULL NAME" --manager MANAGER_EMAIL --year 1 --track data

Example:

    python manage.py add_analyst ama.kusi@gearupafrica.com "Ama Kusi" --manager admin@gearupafrica.com --year 1 --track data
"""
from django.core.management.base import BaseCommand, CommandError

from reviews.models import User


class Command(BaseCommand):
    help = 'Pre-register an analyst (no password). They create one on first sign-in.'

    def add_arguments(self, parser):
        parser.add_argument('email', help="The analyst's email address")
        parser.add_argument('name', help="The analyst's full name, in quotes")
        parser.add_argument('--manager', required=True, help="The manager's email")
        parser.add_argument('--year', type=int, default=1, choices=[1, 2, 3])
        parser.add_argument('--track', default='data', choices=['data', 'ib'],
                            help="'data' = Data Analytics / Engineering, 'ib' = IB / Corp Finance")

    def handle(self, *args, **options):
        email = options['email'].strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise CommandError(f'{email} already exists.')

        try:
            manager = User.objects.get(email__iexact=options['manager'].strip(), role='manager')
        except User.DoesNotExist:
            raise CommandError(f"No manager found with the email {options['manager']}.")

        user = User(
            email=email,
            name=options['name'].strip(),
            role='analyst',
            year_group=options['year'],
            track=options['track'],
            manager=manager,
        )
        user.set_unusable_password()   # no password yet, the analyst creates it
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f'Created {user.name} <{email}> under {manager.name}. '
            f'They can now sign in and create their own password.'
        ))