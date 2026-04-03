from django.db import models

class Job(models.Model):
    """
    Job model to store fetched and sample job data for recommendations.
    """
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    job_url = models.URLField(max_length=1000, blank=True, null=True)
    source = models.CharField(max_length=50, default='Seed') # 'LinkedIn', 'Indeed', 'Seed', etc.
    posted_date = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"
