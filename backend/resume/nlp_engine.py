import spacy
from spacy.matcher import PhraseMatcher
import PyPDF2
from docx import Document
import re
import os

# Load the spaCy model (small English pipeline)
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If not loaded, we can download it or handle the error
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

class NLPEngine:
    """
    JobGenius NLP Engine for Resume Parsing and Skill Extraction.
    """
    
    def __init__(self):
        # A list of common tech skills to look for
        # In a real app, this would be a much larger database or loaded from a file
        self.skills_db = [
            # Programming Languages
            'Python', 'Java', 'Javascript', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Go', 'Kotlin', 'Rust', 'R',
            
            # Frontend
            'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Webpack',
            
            # Backend & Frameworks
            'Django', 'Flask', 'FastAPI', 'Node.js', 'Express', 'Spring Boot', 'Laravel', 'Rails', 'ASP.NET',
            
            # Database
            'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'MariaDB', 'DynamoDB',
            
            # Cloud & DevOps
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'CI/CD', 'Terraform', 'Ansible',
            
            # AI & Data Science
            'Machine Learning', 'Deep Learning', 'AI', 'NLP', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
            'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI', 'Spark', 'Hadoop',
            
            # Others
            'GraphQL', 'REST API', 'Microservices', 'Agile', 'Scrum', 'Figma', 'UI/UX', 'SEO', 'Mobile Development',
            'SwiftUI', 'Flutter', 'React Native', 'Firebase', 'Solidity', 'Blockchain'
        ]
        
        self.matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        # Prepare patterns for matching
        patterns = [nlp.make_doc(skill) for skill in self.skills_db]
        self.matcher.add("SKILLS", patterns)

    def extract_text_from_pdf(self, pdf_path):
        """Extracts text from a PDF file."""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text

    def extract_text_from_docx(self, docx_path):
        """Extracts text from a .docx file."""
        text = ""
        try:
            doc = Document(docx_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
        return text

    def extract_skills(self, text):
        """
        Uses spaCy PhraseMatcher to find relevant skills in the text.
        Returns a list of unique found skills.
        """
        doc = nlp(text)
        matches = self.matcher(doc)
        
        found_skills = set()
        for match_id, start, end in matches:
            span = doc[start:end]
            found_skills.add(span.text)
            
        return list(found_skills)

    def process_resume(self, file_path):
        """
        Main entry point: identifies file type, extracts text, and then finds skills.
        """
        extension = os.path.splitext(file_path)[1].lower()
        
        if extension == '.pdf':
            text = self.extract_text_from_pdf(file_path)
        elif extension == '.docx':
            text = self.extract_text_from_docx(file_path)
        else:
            text = ""
            
        skills = self.extract_skills(text)
        
        return {
            "full_text": text.strip(),
            "skills": skills
        }

# Singleton instance for easy reuse
engine = NLPEngine()
