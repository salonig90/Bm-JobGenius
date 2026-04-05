from .vector_db import vector_db

class JobRecommender:
    """
    Job recommendation engine using ChromaDB Vector Search.
    Converts resume and jobs to embeddings and finds similar matches.
    """
    
    def __init__(self):
        pass

    def score_live_jobs(self, resume_text, live_jobs, top_n=10):
        """
        Refactored to use ChromaDB vector search.
        
        Args:
            resume_text (str): The full extracted text from the resume.
            live_jobs (list): List of job dicts from job_fetcher (live scraped data).
            top_n (int): Number of top matches to return.
        
        Returns:
            list: Top N jobs sorted by match score (descending).
        """
        if not live_jobs or not resume_text:
            return []

        try:
            # Step 1: Add live jobs to ChromaDB
            # This handles embedding generation and vector storage
            vector_db.add_jobs(live_jobs)

            # Step 2: Search for most similar jobs based on resume text
            # This handles query embedding and cosine similarity search
            recommendations = vector_db.search_similar_jobs(
                query_text=resume_text,
                n_results=top_n
            )

            # Optional: Sort recommendations by match_score descending
            recommendations.sort(key=lambda x: x.get('match_score', 0), reverse=True)

            return recommendations

        except Exception as e:
            print(f"Vector search recommendation scoring failed: {e}")
            import traceback
            traceback.print_exc()
            return []

# Singleton instance
recommender = JobRecommender()
