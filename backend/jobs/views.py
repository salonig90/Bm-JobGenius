from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from resume.models import Resume
from .models import Job
from .recommender import recommender
from .job_fetcher import fetcher

class JobRecommendationView(APIView):
    """
    API endpoint that fetches LIVE jobs using job_fetcher (python-jobspy)
    and then ranks them against the resume using TF-IDF + Cosine Similarity.
    If live fetch fails or returns no results, falls back to the seeded database.
    """
    permission_classes = [AllowAny]

    def get(self, request, resume_id, *args, **kwargs):
        try:
            # Step 1: Get the resume and its extracted text
            resume_instance = Resume.objects.get(id=resume_id)
            if not resume_instance.full_text:
                return Response({
                    "error": "Resume text not extracted yet. Please re-upload."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Step 2: Build search term rationally based on skills
            extracted_skills = (resume_instance.extracted_skills or "").lower()
            
            # More specific search queries for better matches
            if 'data science' in extracted_skills or 'machine learning' in extracted_skills:
                search_query = "Data Scientist"
            elif 'django' in extracted_skills or 'flask' in extracted_skills:
                search_query = "Python Django Developer"
            elif 'react' in extracted_skills and ('django' in extracted_skills or 'node' in extracted_skills):
                search_query = "Full Stack Developer"
            elif 'react' in extracted_skills:
                search_query = "Frontend Developer"
            elif 'python' in extracted_skills:
                search_query = "Python Developer"
            elif 'java' in extracted_skills:
                search_query = "Java Developer"
            else:
                search_query = "Software Engineer"

            print(f"[JobRec] Searching for: '{search_query}' (Skills: {extracted_skills[:50]}...)")

            # Step 3: Fetch live jobs using job_fetcher
            live_jobs = []
            try:
                # Optimized live fetch for speed
                live_jobs = fetcher.fetch_live_jobs(
                    search_term=search_query,
                    location="India",
                    results_count=10 # Reduced from 20 for faster response
                )
            except Exception as e:
                print(f"[JobRec] Live fetch failed: {e}")

            # Step 4: Final Fallback to seeded Database if no live jobs found
            source = "live"
            if not live_jobs:
                print("[JobRec] Live fetch returned no results. Falling back to seeded database...")
                db_jobs = Job.objects.all()[:20] # Get up to 20 seeded jobs
                live_jobs = [
                    {
                        "title": job.title,
                        "company": job.company,
                        "location": job.location,
                        "description": job.description,
                        "job_url": "#",
                        "site": "JobGenius DB"
                    } for job in db_jobs
                ]
                source = "database"

            if not live_jobs:
                return Response({
                    "resume_id": resume_id,
                    "recommendations": [],
                    "message": "No jobs found at this moment. Please check back later."
                }, status=status.HTTP_200_OK)

            # Step 5: Score jobs against resume using vector search
            scored_jobs = recommender.score_live_jobs(
                resume_text=resume_instance.full_text,
                live_jobs=live_jobs,
                top_n=10 # Match the results_count for consistency
            )

            return Response({
                "resume_id": resume_id,
                "source": source,
                "total_fetched": len(live_jobs),
                "recommendations": scored_jobs
            }, status=status.HTTP_200_OK)

        except Resume.DoesNotExist:
            return Response({"error": "Resume not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"[JobRec] Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
