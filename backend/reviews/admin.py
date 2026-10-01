from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import User, ReviewPeriod, Review, Feedback, Notification
# Register your models here.


class PreRegisterUserCreationForm(UserCreationForm):
    """The 'Add user' form, with the two password boxes made OPTIONAL.

    - Leave BOTH blank  -> the user is pre-registered with no password. An
      analyst then creates their own password the first time they sign in.
    - Fill in BOTH      -> a normal account with that password (use this for
      managers).
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].required = False
        self.fields['password2'].required = False

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        # Filling in only one box is almost certainly a mistake
        if bool(password1) != bool(password2):
            raise ValidationError(
                'Fill in BOTH password boxes, or leave BOTH blank to pre-register '
                'the analyst so they can create their own password.'
            )
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()   # no password yet
        if commit:
            user.save()
            if hasattr(self, 'save_m2m'):
                self.save_m2m()
        return user


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = PreRegisterUserCreationForm

    list_display = ['name', 'email', 'role', 'year_group', 'track', 'manager', 'is_active']
    list_filter  = ['role', 'year_group', 'track', 'is_active']
    search_fields = ['name', 'email']
    ordering     = ['name']
    actions      = ['reset_password']

    fieldsets = (
        ('Login details', {
            'fields': ('email', 'password')
        }),
        ('Personal information', {
            'fields': ('name', 'role')
        }),
        ('Analyst details', {
            'description': 'Only fill these in for analysts — leave blank for managers',
            'fields': ('year_group', 'track', 'manager')
        }),
        ('Account status', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
    )

    add_fieldsets = (
        ('Create new user', {
            'classes': ('wide',),
            'description': (
                'For an ANALYST: leave both password boxes blank. They will create '
                'their own password the first time they sign in with this email. '
                'For a MANAGER: set a password here.'
            ),
            'fields': (
                'email', 'name', 'password1', 'password2',
                'role', 'year_group', 'track', 'manager', 'is_active'
            ),
        }),
    )

    @admin.action(description='Reset password (analyst creates a new one at next sign-in)')
    def reset_password(self, request, queryset):
        """For a forgotten password: clears it so the analyst can set a new one."""
        count = 0
        for user in queryset.filter(role='analyst'):
            user.set_unusable_password()
            user.save(update_fields=['password'])
            count += 1
        self.message_user(
            request,
            f'{count} analyst(s) can now create a new password the next time they sign in. '
            'Tell them to do it soon. Managers are skipped.',
        )


@admin.register(ReviewPeriod)
class ReviewPeriodAdmin(admin.ModelAdmin):
    list_display  = ['__str__', 'period_type', 'year', 'open_date', 'close_date', 'is_active']
    list_filter   = ['period_type', 'year', 'is_active']
    ordering      = ['-year', 'period_type']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ['analyst', 'period', 'status', 'track_at_submission', 'year_group_at_submission', 'submitted_at']
    list_filter   = ['status', 'period', 'track_at_submission', 'year_group_at_submission']
    search_fields = ['analyst__name', 'analyst__email']
    readonly_fields = ['created_at', 'updated_at', 'submitted_at']
    ordering      = ['-created_at']


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display  = ['manager', 'review', 'status', 'overall_rating', 'submitted_at']
    list_filter   = ['status', 'overall_rating']
    search_fields = ['manager__name', 'review__analyst__name']
    readonly_fields = ['created_at', 'updated_at', 'submitted_at']
    ordering      = ['-created_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ['recipient', 'notification_type', 'is_read', 'created_at']
    list_filter   = ['notification_type', 'is_read']
    search_fields = ['recipient__name']
    ordering      = ['-created_at']