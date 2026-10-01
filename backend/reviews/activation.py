"""
First-time account setup ("activation").

HOW IT WORKS
  1. The manager creates the analyst in Django admin with their email, but NO
     usable password (the account is "pre-registered").
  2. On the login page the analyst types their email. The frontend asks
     POST /api/auth/check-email/  -> { "needs_setup": true }
  3. The frontend shows "Create your password". The analyst chooses one and the
     frontend calls POST /api/auth/activate/. That sets the password and logs
     them in straight away (same response shape as the normal login).

An account can only be set up ONCE: after a password exists, the account is no
longer "claimable", so these endpoints can never overwrite a real password.
"""
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer


class ActivationThrottle(AnonRateThrottle):
    """Limits each IP address to 30 requests a minute on these two endpoints,
    so nobody can script thousands of guesses at which emails exist."""
    scope = 'activation'

    def get_rate(self):
        return '30/min'


def _claimable(user):
    """True only for an active ANALYST whose password has not been set yet."""
    return (
        user is not None
        and user.role == 'analyst'
        and user.is_active
        and not user.has_usable_password()
    )


def _clean_email(value):
    return (value or '').strip().lower()


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([ActivationThrottle])
def check_email_view(request):
    """Tells the login page whether to show 'Sign in' or 'Create your password'.

    It only ever answers true/false. 'Unknown email' and 'already has a
    password' look identical (both false), so it does not reveal who has an
    account.
    """
    email = _clean_email(request.data.get('email'))
    user = User.objects.filter(email__iexact=email).first()
    return Response({'needs_setup': _claimable(user)})


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([ActivationThrottle])
def activate_view(request):
    """Sets the analyst's first password and signs them in."""
    email = _clean_email(request.data.get('email'))
    new_password = request.data.get('new_password') or ''

    # transaction + select_for_update: if two requests arrive at the same moment
    # for the same email, the second waits and then finds the password already
    # set, so only one of them can claim the account.
    with transaction.atomic():
        user = User.objects.select_for_update().filter(email__iexact=email).first()

        if not _claimable(user):
            return Response(
                {'message': 'This account cannot be set up here. If you already '
                            'created a password, sign in instead. Otherwise '
                            'contact your manager.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {'message': 'Your password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Runs the password rules from settings.py (too common, all numbers...)
        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as e:
            return Response(
                {'message': ' '.join(e.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=['password'])

    refresh = RefreshToken.for_user(user)
    return Response({
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    }, status=status.HTTP_200_OK)