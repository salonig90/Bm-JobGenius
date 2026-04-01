from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re

class MLScorer:
    """
    JobGenius ML Scorer for Resume-Job Matching.
    Uses the RandomForestRegressor model to predict match strength.
    
    The ML model name: Random Forest Regressor (Ensemble Model).
    """
    
    def __init__(self):
        # We still use TF-IDF internally to convert text to numeric features for the Forest
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._initialize_and_train_mock_data()

    def _initialize_and_train_mock_data(self):
        """
        Since a Regressor needs to be 'trained', we provide a synthetic set of 
        training data representing common resume-matching patterns.
        """
        # Synthetic features: [Keyword Overlap %, Length Ratio, Skill Density]
        # X: Features, y: Target Match Score
        X_train = np.array([
            [0.9, 1.0, 0.8], # Perfect match
            [0.1, 0.2, 0.1], # Poor match
            [0.5, 0.8, 0.4], # Average match
            [0.7, 0.9, 0.6], # Strong match
            [0.0, 0.1, 0.0], # No match
            [1.0, 1.2, 0.9], # Overqualified match
        ])
        y_train = np.array([95, 10, 50, 75, 5, 98])
        
        self.model.fit(X_train, y_train)

    def clean_text(self, text):
        """Preprocesses text for cleaner feature extraction."""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return text

    def extract_features(self, resume_text, job_description):
        """
        Converts the text into a numeric feature vector for the Random Forest.
        Features used:
        1. Keyword Overlap (Jaccard similarity)
        2. Content Length Ratio
        3. Term Frequency overlap (using TF-IDF)
        """
        r_clean = self.clean_text(resume_text)
        j_clean = self.clean_text(job_description)
        
        r_words = set(r_clean.split())
        j_words = set(j_clean.split())
        
        # 1. Keyword Overlap %
        if not j_words: return [0, 0, 0]
        overlap = len(r_words.intersection(j_words)) / len(j_words)
        
        # 2. Length Ratio (capped)
        len_ratio = min(len(r_clean) / len(j_clean), 2.0) if len(j_clean) > 0 else 0
        
        # 3. Combined TF-IDF Similarity
        tfidf = self.vectorizer.fit_transform([r_clean, j_clean])
        # Dense representation of overlap strength
        dot_product = (tfidf[0] * tfidf[1].T).toarray()[0][0]
        
        return [overlap, len_ratio, dot_product]

    def calculate_score(self, resume_text, job_description):
        """
        Predicts a compatibility score (0-100) using the RandomForestRegressor.
        """
        if not resume_text or not job_description:
            return 0
            
        # Extract features from the inputs
        features = np.array([self.extract_features(resume_text, job_description)])
        
        # Predict the score using the Random Forest model
        predicted_score = self.model.predict(features)[0]
        
        # Ensure score stays within 0-100 range
        return min(max(int(predicted_score), 0), 100)

# Singleton instance for easy reuse
scorer = MLScorer()
