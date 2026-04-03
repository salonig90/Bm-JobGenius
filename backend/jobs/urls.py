from django.urls import path
from .views import JobRecommendationView

urlpatterns = [
    path('recommend/<int:resume_id>/', JobRecommendationView.as_view(), name='job-recommendations'),
]
