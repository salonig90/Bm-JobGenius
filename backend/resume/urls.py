from django.urls import path
from .views import ResumeUploadView, UserRegistrationView, UserResumeDetailView

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('my-resume/', UserResumeDetailView.as_view(), name='user-resume-detail'),
]
