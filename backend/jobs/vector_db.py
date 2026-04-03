import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import os
import uuid

class VectorDB:
    """
    Manages ChromaDB vector storage for job listings.
    Uses sentence-transformers for generating embeddings.
    """
    
    def __init__(self, collection_name="job_listings"):
        # Initialize ChromaDB client with persistent storage
        db_path = os.path.join(os.path.dirname(__file__), 'chroma_db')
        self.client = chromadb.PersistentClient(path=db_path)
        
        # Initialize the embedding model
        # Using a lightweight, high-performance model suitable for job descriptions
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Get or create the collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"} # Use cosine similarity
        )

    def add_jobs(self, jobs):
        """
        Converts job descriptions to vectors and stores them in ChromaDB.
        Args:
            jobs (list): List of job dicts from job_fetcher.
        """
        if not jobs:
            return

        documents = []
        metadatas = []
        ids = []
        
        for job in jobs:
            # Create a rich text representation for embedding
            # Including title and company helps with context
            content = f"Title: {job.get('title', '')}. Company: {job.get('company', '')}. Description: {job.get('description', '')}"
            
            # Use job URL as ID if available, otherwise generate a UUID
            job_id = job.get('job_url') or str(uuid.uuid4())
            
            documents.append(content)
            metadatas.append({
                "title": job.get('title', 'N/A'),
                "company": job.get('company', 'N/A'),
                "location": job.get('location', 'Remote'),
                "job_url": job.get('job_url', ''),
                "source": job.get('site', 'Live')
            })
            ids.append(job_id)

        # Generate embeddings
        embeddings = self.model.encode(documents).tolist()

        # Add to ChromaDB
        self.collection.upsert(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def search_similar_jobs(self, query_text, n_results=30):
        """
        Converts query to vector and searches for similar jobs in ChromaDB.
        Args:
            query_text (str): The text to search for (e.g., resume text).
            n_results (int): Number of top results to return.
        Returns:
            list: Formatted job recommendations.
        """
        # Generate embedding for the query
        query_embedding = self.model.encode([query_text]).tolist()

        # Query ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results
        )

        formatted_results = []
        
        # Extract results from ChromaDB format
        if results['ids'] and results['ids'][0]:
            for i in range(len(results['ids'][0])):
                metadata = results['metadatas'][0][i]
                # ChromaDB distance for cosine space is 1 - similarity
                # So similarity = 1 - distance
                distance = results['distances'][0][i]
                similarity_score = round((1 - distance) * 100, 1)
                
                formatted_results.append({
                    "title": metadata.get('title'),
                    "company": metadata.get('company'),
                    "location": metadata.get('location'),
                    "description": results['documents'][0][i][:300] + "...",
                    "job_url": metadata.get('job_url'),
                    "source": metadata.get('source'),
                    "match_score": similarity_score
                })

        return formatted_results

    def clear_collection(self):
        """Removes all items from the collection."""
        ids = self.collection.get()['ids']
        if ids:
            self.collection.delete(ids=ids)

# Singleton instance
vector_db = VectorDB()
