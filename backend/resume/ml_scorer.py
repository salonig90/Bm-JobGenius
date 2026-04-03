from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re

class MLScorer:
    """
    JobGenius ML Scorer for Resume Quality Assessment.
    Uses a RandomForestRegressor to predict a quality score based on 
    intrinsic resume metrics (skills, impact, metrics, and length).
    """
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        
        # Action verbs that indicate impact and leadership
        self.action_verbs = [
            'led', 'managed', 'developed', 'implemented', 'created', 'designed', 
            'increased', 'decreased', 'optimized', 'launched', 'improved', 
            'spearheaded', 'coordinated', 'negotiated', 'presented', 'delivered'
        ]
        
        # Common technical skill categories for density check
        self.tech_keywords = [
            'python', 'javascript', 'java', 'react', 'django', 'aws', 'docker', 
            'sql', 'mongodb', 'git', 'api', 'cloud', 'ml', 'ai', 'data'
        ]
        
        self._initialize_and_train_mock_data()

    def _initialize_and_train_mock_data(self):
        """
        Trains the model to understand 'Resume Quality' features:
        [Skill Density, Impact Score, Metrics Score, Length Ratio]
        """
        X_train = np.array([ 
            [1.0, 1.0, 1.0, 1.0], [0.9, 0.9, 0.8, 1.0], [0.8, 0.8, 0.7, 0.9], 
            [0.7, 0.7, 0.6, 0.9], [0.6, 0.6, 0.5, 0.8], [0.5, 0.5, 0.4, 0.8], 
            [0.4, 0.4, 0.3, 0.7], [0.3, 0.3, 0.2, 0.6], [0.2, 0.2, 0.1, 0.5], 
            [0.1, 0.1, 0.0, 0.4], [0.0, 0.0, 0.0, 0.2], 
        ]) 
        y_train = np.array([ 
            98, 92, 85, 
            78, 65, 55, 
            45, 35, 25, 
            15, 5, 
        ]) 
        
        self.model.fit(X_train, y_train)

    def clean_text(self, text):
        """Preprocesses text for cleaner feature extraction."""
        text = str(text).lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        return text

    def extract_quality_features(self, text):
        """
        Extracts intrinsic quality features from the resume text:
        1. Skill Density: Count of technical keywords.
        2. Impact Score: Count of strong action verbs.
        3. Metrics Score: Count of numbers/percentages (quantifiable results).
        4. Length Ratio: Word count relative to an ideal length (~400-600 words).
        """
        clean_text = self.clean_text(text)
        words = clean_text.split()
        
        if not words:
            return [0, 0, 0, 0]

        # 1. Skill Density (Target: 10+ tech keywords)
        skill_count = sum(1 for word in words if word in self.tech_keywords)
        skill_density = min(skill_count / 10, 1.2)

        # 2. Impact Score (Target: 8+ action verbs)
        impact_count = sum(1 for word in words if word in self.action_verbs)
        impact_score = min(impact_count / 8, 1.2)

        # 3. Metrics Score (Target: 5+ numbers/percentages)
        # Look for numbers like 10, 50%, $100k
        metrics_count = len(re.findall(r'\d+', text))
        metrics_score = min(metrics_count / 5, 1.2)

        # 4. Length Ratio (Target: 500 words)
        length_ratio = min(len(words) / 500, 1.5)
        if length_ratio < 0.3: length_ratio = 0.1 # Too short is bad

        return [skill_density, impact_score, metrics_score, length_ratio]

    def calculate_score(self, resume_text, benchmark_text=None):
        """
        Predicts a Quality Score (0-100) based on intrinsic resume metrics.
        The benchmark_text is ignored in this quality-focused mode.
        """
        if not resume_text or len(str(resume_text).strip()) < 20:
            return 0
            
        # Extract intrinsic quality features
        features = np.array([self.extract_quality_features(resume_text)])
        
        # Predict the quality score
        predicted_score = self.model.predict(features)[0]
        
        # Ensure score stays within 0-100 range
        return min(max(int(predicted_score), 0), 100)

# Singleton instance for easy reuse
scorer = MLScorer()
