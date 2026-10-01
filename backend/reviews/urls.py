from .activation import check_email_view, activate_view
from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/',           views.login_view,           name='login'),
    path('auth/logout/',          views.logout_view,          name='logout'),
    path('auth/me/',              views.me_view,              name='me'),
    path('auth/change-password/', views.change_password_view, name='change-password'),
    path('periods/',              views.review_periods_view,  name='periods'),
    path('reviews/my/',           views.analyst_my_reviews,   name='my-reviews'),
    path('reviews/submit/',       views.analyst_submit_review,name='submit-review'),
    path('manager/team/',                             views.manager_team_view,        name='manager-team'),
    path('manager/reviews/<int:review_id>/',          views.manager_get_review,       name='manager-review'),
    path('manager/reviews/<int:review_id>/feedback/', views.manager_submit_feedback,  name='manager-feedback'),
    path('notifications/',                            views.notifications_view,       name='notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read,   name='mark-read'),
    path('notifications/read-all/',                   views.mark_all_notifications_read, name='read-all'),
    path('auth/check-email/', check_email_view),
    path('auth/activate/', activate_view),
]