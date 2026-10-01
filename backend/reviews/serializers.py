from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, ReviewPeriod, Review, Feedback, Notification


class UserSerializer(serializers.ModelSerializer):
    track_display = serializers.CharField(source='get_track_display_name', read_only=True)
    year_group_display = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'role',
            'year_group', 'year_group_display',
            'track', 'track_display',
            'manager', 'manager_name',
            'is_active',
        ]
        read_only_fields = ['id', 'email', 'role']

    def get_year_group_display(self, obj):
        if obj.year_group:
            return f'Year {obj.year_group}'
        return None

    def get_manager_name(self, obj):
        if obj.manager:
            return obj.manager.name
        return None


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email    = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError('Email and password are required')

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password')

        if not user.is_active:
            raise serializers.ValidationError(
                'Your account is inactive. Please contact your manager.'
            )

        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters')
        return value


class ReviewPeriodSerializer(serializers.ModelSerializer):
    period_type_display = serializers.CharField(source='get_period_type_display', read_only=True)
    is_open = serializers.SerializerMethodField()

    class Meta:
        model  = ReviewPeriod
        fields = [
            'id', 'period_type', 'period_type_display',
            'year', 'open_date', 'close_date',
            'is_active', 'is_open',
        ]

    def get_is_open(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        return obj.open_date <= today <= obj.close_date


class FeedbackSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.name', read_only=True)

    class Meta:
        model  = Feedback
        fields = [
            'id', 'review', 'manager', 'manager_name',
            'status', 'overall_rating',
            'strengths', 'development_areas', 'goals_next_period',
            'created_at', 'submitted_at',
        ]
        read_only_fields = ['id', 'manager', 'created_at', 'submitted_at']


class ReviewSerializer(serializers.ModelSerializer):
    analyst_name   = serializers.CharField(source='analyst.name', read_only=True)
    analyst_email  = serializers.CharField(source='analyst.email', read_only=True)
    period_display = serializers.CharField(source='period.__str__', read_only=True)
    has_feedback   = serializers.SerializerMethodField()
    feedback       = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = [
            'id', 'analyst', 'analyst_name', 'analyst_email',
            'period', 'period_display',
            'year_group_at_submission', 'track_at_submission',
            'status', 'full_name', 'email', 'semester', 'date_submitted',
            'accomplishments', 'challenges', 'response_to_challenges',
            'guidance_applied', 'real_world_contribution',
            'personal_growth', 'community_contribution', 'development_goals',
            'rating_technical', 'rating_miniships', 'rating_personal',
            'rating_community', 'rating_guidance',
            'areas_worked_on', 'overall_rating',
            'has_feedback', 'feedback',
            'created_at', 'submitted_at',
        ]
        read_only_fields = [
            'id', 'analyst', 'year_group_at_submission',
            'track_at_submission', 'created_at', 'submitted_at',
        ]

    def get_has_feedback(self, obj):
        return hasattr(obj, 'feedback') and obj.feedback.status == 'submitted'

    def get_feedback(self, obj):
        if hasattr(obj, 'feedback') and obj.feedback.status == 'submitted':
            return FeedbackSerializer(obj.feedback).data
        return None


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ['id', 'notification_type', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'notification_type', 'message', 'created_at']