from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics
from .serializers import ResumeSerializer, UserRegistrationSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from .nlp_engine import engine
from .ml_scorer import scorer

STRONG_RESUME_BENCHMARK = """ 
Experienced professional with skills in Python, Django, 
React, JavaScript, SQL, MongoDB, Machine Learning, 
Deep Learning, TensorFlow, scikit-learn, Docker, AWS, 
Git, REST API, Node.js, Data Analysis, Power BI. 
Bachelor degree in Computer Science Engineering from 
reputed university. 
3 years of experience working on projects and internships. 
Developed and implemented multiple projects including 
web applications and machine learning models. 
Certified in relevant technologies. 
Summary: Passionate software engineer with strong 
problem solving skills. 
LinkedIn profile available. GitHub portfolio with 
open source contributions. 
Led teams, collaborated with stakeholders, delivered 
results on time. 
 """ 

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

class ResumeUploadView(APIView):
    """
    API endpoint for uploading resume files and triggering AI analysis.
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny,)
    authentication_classes = [] # Disable auth for this endpoint to prevent token errors during dev

    def post(self, request, *args, **kwargs):
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            resume_instance = serializer.save()
            
            # Analysis pipeline
            results = {"skills": []}
            score_label = "Pending" # Default label
            
            try:
                # 1. NLP: Extract skills and text
                print(f"[Upload] Starting NLP extraction for {resume_instance.file.path}")
                results = engine.process_resume(resume_instance.file.path)
                resume_instance.full_text = results.get("full_text", "")
                resume_instance.extracted_skills = ", ".join(results.get("skills", []))
                print(f"[Upload] Skills extracted: {len(results.get('skills', []))}")
                
                # 2. ML Scoring (Similarity matching)
                print("[Upload] Starting ML scoring...")
                resume_instance.compatibility_score = scorer.calculate_score(resume_instance.full_text, STRONG_RESUME_BENCHMARK)
                
                # Determine score label
                score = resume_instance.compatibility_score
                if score >= 80:
                    score_label = "Excellent"
                elif score >= 60:
                    score_label = "Good"
                elif score >= 40:
                    score_label = "Average"
                else:
                    score_label = "Needs Improvement"
                
                print(f"[Upload] Compatibility Score: {resume_instance.compatibility_score} ({score_label})")
                
                # 3. Final Save
                resume_instance.save()
                print("[Upload] Analysis pipeline complete and saved.")
            except Exception as e:
                print(f"Error during analysis pipeline: {str(e)}")
                import traceback
                traceback.print_exc()

            return Response({
                "message": "Resume uploaded and analyzed successfully!", 
                "data": ResumeSerializer(resume_instance).data,
                "extracted_skills": results.get("skills", []),
                "match_score": resume_instance.compatibility_score,
                "score": resume_instance.compatibility_score,
                "score_label": score_label
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
