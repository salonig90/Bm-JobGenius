from django.urls import path
from .views import ResumeImprovementView

urlpatterns = [
    path('suggestions/<int:resume_id>/', ResumeImprovementView.as_view(), name='resume-suggestions'),
]
