from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics
from .serializers import ResumeSerializer, UserRegistrationSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from .nlp_engine import engine
from .ml_scorer import scorer
from .sentimental import sentiment_engine

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

class ResumeUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            resume_instance = serializer.save()
            
            # Analysis pipeline
            results = {"skills": []}
            career_analysis = {"tone": "NEUTRAL"}
            professional_feedback = "Analysis complete."
            
            try:
                # NLP: Extract skills and text
                results = engine.process_resume(resume_instance.file.path)
                resume_instance.full_text = results.get("full_text", "")
                resume_instance.extracted_skills = ", ".join(results.get("skills", []))
                
                # ML Scoring
                sample_jd = "Software Engineer with Python, React, and AI knowledge."
                resume_instance.compatibility_score = scorer.calculate_score(resume_instance.full_text, sample_jd)
                
                # Tone Analysis
                career_analysis = sentiment_engine.analyze_career_tone(resume_instance.full_text, score=resume_instance.compatibility_score)
                resume_instance.resume_sentiment = career_analysis.get("career_label", "PENDING")
                professional_feedback = career_analysis.get("feedback", "")
                
                resume_instance.save()
            except Exception as e:
                print(f"Error during analysis pipeline: {e}")

            return Response({
                "message": "Resume uploaded and analyzed successfully!", 
                "data": ResumeSerializer(resume_instance).data,
                "extracted_skills": results.get("skills", []),
                "match_score": resume_instance.compatibility_score,
                "sentiment": {
                    "label": resume_instance.resume_sentiment,
                    "feedback": professional_feedback,
                    "tone": career_analysis.get("tone", "NEUTRAL")
                }
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
