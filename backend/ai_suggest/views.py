from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from resume.models import Resume
from .gemini_advisor import advisor

class ResumeImprovementView(APIView):
    """
    API View that provides AI-generated suggestions to improve a specific resume.
    Uses Google's Gemini model via GeminiAdvisor.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, resume_id, *args, **kwargs):
        try:
            # 1. Get the resume (ensure it belongs to the current user)
            resume = Resume.objects.get(id=resume_id, user=request.user)
            
            if not resume.full_text:
                return Response({
                    "error": "Resume text not available for analysis."
                }, status=status.HTTP_400_BAD_REQUEST)

            # 2. Get suggestions from Gemini
            print(f"[AI-Suggest] Fetching suggestions for resume ID: {resume_id}")
            suggestions = advisor.get_improvement_suggestions(resume.full_text)

            return Response({
                "resume_id": resume_id,
                "suggestions": suggestions,
                "model": advisor.model_name
            }, status=status.HTTP_200_OK)

        except Resume.DoesNotExist:
            return Response({
                "error": "Resume not found."
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"[AI-Suggest] Critical Error: {str(e)}")
            return Response({
                "error": "An internal error occurred while generating suggestions."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
