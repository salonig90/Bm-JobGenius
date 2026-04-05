import google.generativeai as genai
import os
from django.conf import settings

class GeminiAdvisor:
    """
    Advisor class that uses Google's Gemini Pro model to provide 
    constructive suggestions for resume improvement.
    """
    
    def __init__(self):
        # API Key should be in .env or settings
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = "gemini-2.5-flash" # Default to 2.5-flash
        self.is_initialized = False

    def _ensure_initialized(self):
        if not self.is_initialized:
            # Re-check environment if api_key is missing
            if not self.api_key:
                self.api_key = os.getenv("GEMINI_API_KEY")
                
            if not self.api_key:
                print("[GeminiAdvisor] Warning: GEMINI_API_KEY not found in environment.")
                return False
            
            genai.configure(api_key=self.api_key)
            
            # Try to find an available model if default fails
            try:
                self.model = genai.GenerativeModel(self.model_name)
                # Test the model with a simple call to verify quota
                self.model.generate_content("test")
            except Exception as e:
                print(f"[GeminiAdvisor] {self.model_name} failed: {str(e)}. Trying fallback...")
                fallback_models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
                for fallback in fallback_models:
                    try:
                        self.model = genai.GenerativeModel(fallback)
                        self.model.generate_content("test")
                        self.model_name = fallback
                        print(f"[GeminiAdvisor] Switched to fallback model: {fallback}")
                        break
                    except:
                        continue
            
            self.is_initialized = True
        return True

    def get_improvement_suggestions(self, resume_text):
        """
        Sends resume text to Gemini and asks for specific improvement tips.
        """
        if not resume_text or len(resume_text.strip()) < 50:
            return ["Resume text is too short for a meaningful AI analysis. Please provide more detail."]

        if not self._ensure_initialized():
            return ["AI Advisor is currently unavailable (API Key missing). Please check backend configuration."]

        prompt = f"""
        You are a highly experienced technical recruiter and career coach.
        Analyze the following resume text and provide 5-7 highly specific, actionable, and unique suggestions 
        to improve this specific individual's profile. 

        Focus your analysis on:
        1. Quantifiable Achievements: Suggest where to add specific metrics, percentages, or data-driven results.
        2. Technical Depth: Identify areas to better explain system architecture, problem-solving, or tool usage.
        3. Strategic Action Verbs: Replace weak language with powerful, high-impact technical verbs.
        4. Industry Alignment: Suggest how to bridge current experience with modern tech trends (e.g., Cloud, GenAI).
        5. Skill Gap Analysis: Highlight specific, missing high-demand technologies relevant to their career path.
        
        Resume Text:
        {resume_text}
        
        IMPORTANT: Your response MUST be highly tailored to the content of this specific resume. 
        Avoid suggestions about minor formatting or moving text around. Focus purely on TECHNICAL DEPTH and IMPACT.
        
        Format each suggestion EXACTLY like this:
        1. **Title**: Full description here in the same paragraph.
        
        Provide exactly 5 to 6 such points.
        Return the suggestions as a numbered list. 
        CRITICAL: Each numbered point MUST be a single paragraph. 
        Do NOT use bullet points or newlines inside a suggestion.
        The Title must be in bold (**Title**) followed by a colon and the description.
        Example:
        1. **Quantify Impact**: Instead of saying "worked on SQL", specify that you "Optimized complex SQL queries, reducing database response time by 30% for high-volume transactions."
        
        Do not include an introduction, a conclusion, or a title.
        """

        try:
            response = self.model.generate_content(prompt)
            raw_text = response.text
            
            # Smart parsing to group lines belonging to the same numbered point
            suggestions = []
            current_suggestion = ""
            
            for line in raw_text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                
                # If line starts with a number (e.g., "1. "), it's a new point
                import re
                if re.match(r'^\d+\.', line):
                    if current_suggestion:
                        suggestions.append(current_suggestion)
                    current_suggestion = line
                else:
                    # If it doesn't start with a number, it's a continuation of the previous point
                    if current_suggestion:
                        current_suggestion += " " + line
                    else:
                        current_suggestion = line
            
            if current_suggestion:
                suggestions.append(current_suggestion)
                
            return suggestions
        except Exception as e:
            print(f"[GeminiAdvisor] Error: {str(e)}")
            return ["The AI advisor encountered an error while processing your request. Please try again later."]

# Singleton instance
advisor = GeminiAdvisor()
