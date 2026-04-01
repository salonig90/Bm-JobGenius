from django.urls import path
from .views import ResumeUploadView, UserRegistrationView

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
]
