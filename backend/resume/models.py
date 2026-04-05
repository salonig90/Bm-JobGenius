from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes', null=True, blank=True)
    file = models.FileField(
        upload_to='resumes/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'docx'])]
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    full_text = models.TextField(blank=True, null=True)
    extracted_skills = models.TextField(blank=True, null=True)
    compatibility_score = models.IntegerField(default=0)
    resume_sentiment = models.CharField(max_length=50, blank=True, null=True)  # FinBERT sentiment

    def __str__(self):
        return f"Resume {self.id} - {self.file.name}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
