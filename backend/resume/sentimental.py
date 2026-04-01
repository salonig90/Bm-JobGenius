from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch

class SentimentalAnalysis:
    """
    JobGenius Career Sentiment & Match Analysis Engine.
    Uses FinBERT (Financial/Professional BERT) combined with ML Match Scores 
    to provide high-impact career progression feedback.
    """
    
    def __init__(self):
        self.model_name = "ProsusAI/finbert"
        self.nlp = None
        self.is_ready = False
        self._initialization_attempted = False

    def _lazy_load_model(self):
        """Attempts to load the FinBERT model only when needed."""
        if self._initialization_attempted:
            return
            
        print("FinBERT: Attempting to load model (this may take a few minutes for the first time)...")
        self._initialization_attempted = True
        try:
            # Initialize the tokenizer and model for professional tone analysis
            tokenizer = AutoTokenizer.from_pretrained(self.model_name, local_files_only=False)
            model = AutoModelForSequenceClassification.from_pretrained(self.model_name, local_files_only=False)
            
            # Setup the Sentiment pipeline
            self.nlp = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
            self.is_ready = True
            print("FinBERT: Model loaded successfully!")
        except Exception as e:
            print(f"FinBERT: Model failed to load (falling back to simple analysis): {e}")
            self.is_ready = False

    def mock_analyze_tone(self, text):
        """Simplified analysis for when the full model is unavailable."""
        pos_words = ['excellent', 'expert', 'lead', 'managed', 'achieved', 'professional']
        neg_words = ['bad', 'poor', 'failed', 'fired', 'weak', 'basic']
        
        text_lower = text.lower()
        pos_count = sum(1 for w in pos_words if w in text_lower)
        neg_count = sum(1 for w in neg_words if w in text_lower)
        
        if pos_count > neg_count:
            return {"label": "POSITIVE", "score": 0.5 + (pos_count/20)}
        else:
            return {"label": "NEUTRAL", "score": 0.8}

    def get_match_label(self, score):
        """
        Maps the numeric ML match score to professional career labels.
        """
        if score is None: return "PENDING"
        
        if score >= 85:
            return "OUTSTANDING MATCH"
        elif score >= 70:
            return "STRONG MATCH"
        elif score >= 55:
            return "GOOD MATCH"
        elif score >= 40:
            return "AVERAGE MATCH"
        else:
            return "LOW MATCH"

    def analyze_career_tone(self, text, score=None):
        """
        Performs a dual-layer analysis using the best available model.
        """
        # Trigger lazy load
        self._lazy_load_model()
        
        # Determine career label from match score
        career_label = self.get_match_label(score)
        
        # Ensure we have text to analyze
        if not text.strip():
             return {
                "tone": "NEUTRAL", 
                "confidence": 0.0, 
                "career_label": career_label, 
                "feedback": "Could not identify text in resume. Please ensure it is not an image-based PDF."
            }

        try:
            # Use FinBERT if ready, otherwise fallback to mock
            if self.is_ready:
                analysis_results = self.nlp(text[:1000])
                if analysis_results:
                    result = analysis_results[0]
                    tone_label = result['label'].upper()
                    tone_confidence = result['score']
                else:
                    tone_label, tone_confidence = "NEUTRAL", 0.8
            else:
                # Mock fallback
                mock_result = self.mock_analyze_tone(text)
                tone_label = mock_result['label']
                tone_confidence = mock_result['score']
                
            # Professional Feedback logic
            if score >= 80:
                if tone_label == 'POSITIVE':
                    feedback = "Expertly written profile! Your skills and tone align perfectly with industry standards."
                else:
                    feedback = "Stellar skills detected, but consider using more action-oriented language to boost your impact."
            elif score >= 50:
                feedback = f"Solid foundation. Your profile shows a '{career_label}' status with a '{tone_label}' tone."
            else:
                feedback = "Your profile needs content enrichment. Try incorporating more relevant keywords and technical details."
                
            return {
                "tone": tone_label,
                "confidence": tone_confidence,
                "career_label": career_label,
                "feedback": feedback
            }
        except Exception as e:
            print(f"Career Analysis failed: {e}")
            return {"tone": "NEUTRAL", "confidence": 0.0, "career_label": "NEUTRAL", "feedback": "An error occurred during analysis."}

# Singleton instance for easy reuse
sentiment_engine = SentimentalAnalysis()
