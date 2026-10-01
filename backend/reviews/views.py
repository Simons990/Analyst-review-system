from django.shortcuts import render

# Create your views here.
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, ReviewPeriod, Review, Feedback, Notification
from .serializers import (
    UserSerializer, LoginSerializer, ChangePasswordSerializer,
    ReviewPeriodSerializer, ReviewSerializer,
    FeedbackSerializer, NotificationSerializer,
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# ── AUTH VIEWS ────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {'message': list(serializer.errors.values())[0][0]},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = serializer.validated_data['user']
    tokens = get_tokens_for_user(user)
    return Response({
        'token': tokens['access'],
        'refresh': tokens['refresh'],
        'user': UserSerializer(user).data,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logged out successfully'})
    except Exception:
        return Response({'message': 'Logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(
        data=request.data,
        context={'request': request}
    )
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    request.user.set_password(serializer.validated_data['new_password'])
    request.user.save()
    return Response({'message': 'Password changed successfully'})


# ── REVIEW PERIOD VIEWS ───────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def review_periods_view(request):
    periods = ReviewPeriod.objects.filter(is_active=True)
    serializer = ReviewPeriodSerializer(periods, many=True)
    return Response(serializer.data)


# ── ANALYST VIEWS ─────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyst_my_reviews(request):
    if request.user.role != 'analyst':
        return Response(
            {'message': 'Only analysts can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )
    reviews = Review.objects.filter(analyst=request.user).select_related('period')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyst_submit_review(request):
    if request.user.role != 'analyst':
        return Response(
            {'message': 'Only analysts can submit reviews'},
            status=status.HTTP_403_FORBIDDEN
        )

    period_id = request.data.get('period_id')
    action = request.data.get('action', 'draft')

    try:
        period = ReviewPeriod.objects.get(id=period_id, is_active=True)
    except ReviewPeriod.DoesNotExist:
        return Response(
            {'message': 'Review period not found or not active'},
            status=status.HTTP_404_NOT_FOUND
        )

    today = timezone.now().date()
    if today > period.close_date:
        return Response(
            {'message': 'This review period has closed. The deadline has passed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    review, created = Review.objects.get_or_create(
        analyst=request.user,
        period=period,
        defaults={
            'year_group_at_submission': request.user.year_group,
            'track_at_submission': request.user.track,
        }
    )

    if review.status == 'submitted' and not created:
        return Response(
            {'message': 'You have already submitted this review'},
            status=status.HTTP_400_BAD_REQUEST
        )

    review.full_name               = request.data.get('fullName', '')
    review.email                   = request.data.get('email', '')
    review.semester                = request.data.get('semester', '')
    review.date_submitted          = request.data.get('dateSubmitted')
    review.accomplishments         = request.data.get('accomplishments', '')
    review.challenges              = request.data.get('challenges', '')
    review.response_to_challenges  = request.data.get('response', '')
    review.guidance_applied        = request.data.get('guidance', '')
    review.real_world_contribution = request.data.get('contribution', '')
    review.personal_growth         = request.data.get('growth', '')
    review.community_contribution  = request.data.get('communityContribution', '')
    review.development_goals       = request.data.get('development', '')
    review.rating_technical        = request.data.get('ratingTechnical', 0)
    review.rating_miniships        = request.data.get('ratingMiniships', 0)
    review.rating_personal         = request.data.get('ratingPersonal', 0)
    review.rating_community        = request.data.get('ratingCommunity', 0)
    review.rating_guidance         = request.data.get('ratingGuidance', 0)
    review.overall_rating          = request.data.get('rating', 0)

    areas = request.data.get('areas', [])
    review.areas_worked_on = ','.join(areas) if isinstance(areas, list) else areas

    if action == 'submit':
        review.status = 'submitted'
        review.submitted_at = timezone.now()
        if request.user.manager:
            Notification.objects.create(
                recipient=request.user.manager,
                notification_type='review_submitted',
                message=f'{request.user.name} has submitted their {period.get_period_type_display()}. Review it now.',
            )
    else:
        review.status = 'draft'

    review.save()

    return Response({
        'message': 'Review submitted successfully' if action == 'submit' else 'Draft saved',
        'review': ReviewSerializer(review).data,
    }, status=status.HTTP_200_OK)


# ── MANAGER VIEWS ─────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_team_view(request):
    if request.user.role != 'manager':
        return Response(
            {'message': 'Only managers can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )

    analysts = User.objects.filter(
        manager=request.user,
        role='analyst'
    ).prefetch_related('reviews__period', 'reviews__feedback')

    team_data = []
    for analyst in analysts:
        analyst_data = UserSerializer(analyst).data
        analyst_data['reviews'] = []

        for review in analyst.reviews.all():
            review_data = {
                'id': review.id,
                'period_type': review.period.period_type,
                'period_display': str(review.period),
                'status': review.status,
                'submitted_at': review.submitted_at,
                'feedback_status': 'waiting',
            }

            if hasattr(review, 'feedback'):
                if review.feedback.status == 'submitted':
                    review_data['feedback_status'] = 'done'
                else:
                    review_data['feedback_status'] = 'draft'
            elif review.status == 'submitted':
                review_data['feedback_status'] = 'pending'

            analyst_data['reviews'].append(review_data)

        team_data.append(analyst_data)

    return Response(team_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_get_review(request, review_id):
    if request.user.role != 'manager':
        return Response(
            {'message': 'Only managers can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        review = Review.objects.select_related(
            'analyst', 'period', 'feedback'
        ).get(
            id=review_id,
            analyst__manager=request.user
        )
    except Review.DoesNotExist:
        return Response(
            {'message': 'Review not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(ReviewSerializer(review).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manager_submit_feedback(request, review_id):
    if request.user.role != 'manager':
        return Response(
            {'message': 'Only managers can submit feedback'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        review = Review.objects.select_related('analyst').get(
            id=review_id,
            analyst__manager=request.user
        )
    except Review.DoesNotExist:
        return Response(
            {'message': 'Review not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if review.status != 'submitted':
        return Response(
            {'message': 'Cannot give feedback on a review that has not been submitted yet'},
            status=status.HTTP_400_BAD_REQUEST
        )

    action = request.data.get('action', 'submit')

    feedback, created = Feedback.objects.get_or_create(
        review=review,
        defaults={'manager': request.user}
    )

    feedback.overall_rating    = request.data.get('overall_rating', 0)
    feedback.strengths         = request.data.get('strengths', '')
    feedback.development_areas = request.data.get('development_areas', '')
    feedback.goals_next_period = request.data.get('goals_next_period', '')

    if action == 'submit':
        feedback.status = 'submitted'
        feedback.submitted_at = timezone.now()
        Notification.objects.create(
            recipient=review.analyst,
            notification_type='feedback_received',
            message=f'Your manager has submitted feedback on your {review.period.get_period_type_display()}. Log in to view it.',
        )
    else:
        feedback.status = 'draft'

    feedback.save()

    return Response({
        'message': 'Feedback submitted' if action == 'submit' else 'Feedback draft saved',
        'feedback': FeedbackSerializer(feedback).data,
    }, status=status.HTTP_200_OK)


# ── NOTIFICATION VIEWS ────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_view(request):
    notifications = Notification.objects.filter(recipient=request.user)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(
            id=notification_id,
            recipient=request.user
        )
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    except Notification.DoesNotExist:
        return Response(
            {'message': 'Notification not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).update(is_read=True)
    return Response({'message': 'All notifications marked as read'})