from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# ── USER MANAGER ──────────────────────────────────────────────────────────────
# Django needs a manager class to handle creating users and superusers
# This replaces the default manager because we use email instead of username

class UserManager(BaseUserManager):

    def create_user(self, email, name, password=None, **extra_fields):
        """Creates a regular analyst or manager account"""
        if not email:
            raise ValueError('Email address is required')
        if not name:
            raise ValueError('Name is required')

        # Normalise email — converts Gmail.COM to gmail.com
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)

        # Hash the password — never store plain text passwords
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """Creates a Django admin superuser — only used by you via terminal"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'manager')
        return self.create_user(email, name, password, **extra_fields)


# ── USER MODEL ────────────────────────────────────────────────────────────────
# Replaces Django's default User model
# Every analyst and manager is stored here

class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [
        ('analyst', 'Analyst'),
        ('manager', 'Manager'),
    ]

    YEAR_GROUP_CHOICES = [
        (1, 'Year 1'),
        (2, 'Year 2'),
        (3, 'Year 3'),
    ]

    TRACK_CHOICES = [
        ('data', 'Data Analytics / Engineering'),
        ('ib', 'IB / Corp Finance'),
    ]

    # Core fields
    email      = models.EmailField(unique=True)    # Used for login instead of username
    name       = models.CharField(max_length=255)
    role       = models.CharField(max_length=10, choices=ROLE_CHOICES, default='analyst')

    # Analyst-specific fields — null/blank allowed for managers
    year_group = models.IntegerField(choices=YEAR_GROUP_CHOICES, null=True, blank=True)
    track      = models.CharField(max_length=10, choices=TRACK_CHOICES, null=True, blank=True)

    # Links an analyst to their manager
    # null=True means managers don't need a manager assigned to them
    manager    = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='team_members',
        limit_choices_to={'role': 'manager'},
    )

    # Tracks whether the analyst is still active in the programme
    # Set to False when they complete Year 3 — keeps their history but blocks login
    is_active      = models.BooleanField(default=True)
    is_staff       = models.BooleanField(default=False)  # Needed for Django admin access

    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    # Tell Django to use email as the login field instead of username
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.name} ({self.role})'

    def get_track_display_name(self):
        """Returns the human readable track name"""
        track_map = {
            'data': 'Data Analytics / Engineering',
            'ib': 'IB / Corp Finance',
        }
        return track_map.get(self.track, '')


# ── REVIEW PERIOD MODEL ───────────────────────────────────────────────────────
# Controls when analysts can submit reviews
# The manager or admin opens and closes periods from Django admin

class ReviewPeriod(models.Model):

    PERIOD_TYPE_CHOICES = [
        ('mid', 'Mid-Semester Review'),
        ('end', 'End-of-Semester Review'),
    ]

    period_type  = models.CharField(max_length=5, choices=PERIOD_TYPE_CHOICES)
    year         = models.IntegerField()           # e.g. 2025
    open_date    = models.DateField()              # When analysts can start submitting
    close_date   = models.DateField()              # Deadline — form locks after this
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'review_periods'
        # Prevents duplicate periods — only one mid or end review per year
        unique_together = ['period_type', 'year']
        ordering = ['-year', 'period_type']

    def __str__(self):
        return f'{self.get_period_type_display()} — {self.year}'


# ── REVIEW MODEL ──────────────────────────────────────────────────────────────
# Stores everything an analyst fills in on their review form

class Review(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),         # Analyst saved but not submitted yet
        ('submitted', 'Submitted'), # Analyst submitted — manager can now read it
    ]

    # Links review to the analyst who wrote it
    analyst        = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews',
        limit_choices_to={'role': 'analyst'},
    )

    # Links review to its period (mid or end of semester)
    period         = models.ForeignKey(
        ReviewPeriod,
        on_delete=models.CASCADE,
        related_name='reviews',
    )

    # Snapshot of year group at time of submission
    # Important — even if analyst moves to Year 2 later,
    # this review will still correctly show Year 1
    year_group_at_submission = models.IntegerField(null=True, blank=True)
    track_at_submission      = models.CharField(max_length=10, null=True, blank=True)

    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    # Personal information section
    full_name      = models.CharField(max_length=255)
    email          = models.EmailField()
    semester       = models.CharField(max_length=50)   # e.g. "Year 1 Semester 1"
    date_submitted = models.DateField(null=True, blank=True)

    # Self reflection questions — all the text areas from the form
    accomplishments         = models.TextField(blank=True)
    challenges              = models.TextField(blank=True)
    response_to_challenges  = models.TextField(blank=True)
    guidance_applied        = models.TextField(blank=True)
    real_world_contribution = models.TextField(blank=True)
    personal_growth         = models.TextField(blank=True)
    community_contribution  = models.TextField(blank=True)
    development_goals       = models.TextField(blank=True)

    # Rating grid — stores each category score as an integer 1-5
    rating_technical  = models.IntegerField(default=0)
    rating_miniships  = models.IntegerField(default=0)
    rating_personal   = models.IntegerField(default=0)
    rating_community  = models.IntegerField(default=0)
    rating_guidance   = models.IntegerField(default=0)

    # Areas worked on — stored as comma separated string
    # e.g. "Financial analysis,Leadership & initiative,Certifications"
    areas_worked_on   = models.TextField(blank=True)

    # Overall self rating 1-5
    overall_rating    = models.IntegerField(default=0)

    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    submitted_at      = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'reviews'
        # One review per analyst per period — can't submit twice
        unique_together = ['analyst', 'period']
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.analyst.name} — {self.period}'


# ── FEEDBACK MODEL ────────────────────────────────────────────────────────────
# Stores the manager's feedback on a submitted review
# One feedback per review — manager can update it but not create a second one

class Feedback(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
    ]

    # One feedback linked to exactly one review
    review         = models.OneToOneField(
        Review,
        on_delete=models.CASCADE,
        related_name='feedback',
    )

    # The manager who wrote this feedback
    manager        = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='feedback_given',
        limit_choices_to={'role': 'manager'},
    )

    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    # Manager's written feedback — mirrors what we built in the frontend
    overall_rating    = models.IntegerField(default=0)   # Manager's rating 1-5
    strengths         = models.TextField(blank=True)
    development_areas = models.TextField(blank=True)
    goals_next_period = models.TextField(blank=True)

    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    submitted_at      = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f'Feedback by {self.manager.name} on {self.review}'


# ── NOTIFICATION MODEL ────────────────────────────────────────────────────────
# Stores notifications for both analysts and managers
# Analyst gets notified when manager submits feedback
# Manager gets notified when analyst submits a review

class Notification(models.Model):

    NOTIFICATION_TYPE_CHOICES = [
        ('review_submitted', 'Review submitted'),   # Sent to manager
        ('feedback_received', 'Feedback received'), # Sent to analyst
    ]

    # Who receives this notification
    recipient      = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
    )

    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    message           = models.TextField()
    is_read           = models.BooleanField(default=False)
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']  # Newest notifications first

    def __str__(self):
        return f'Notification for {self.recipient.name} — {self.notification_type}'