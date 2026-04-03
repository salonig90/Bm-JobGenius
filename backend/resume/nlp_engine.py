import spacy
from spacy.matcher import PhraseMatcher
import PyPDF2
from docx import Document
import re
import os

# Global NLP variable
_nlp_instance = None

def get_nlp():
    global _nlp_instance
    if _nlp_instance is None:
        import spacy
        try:
            _nlp_instance = spacy.load("en_core_web_sm")
        except:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            _nlp_instance = spacy.load("en_core_web_sm")
    return _nlp_instance

class NLPEngine:
    """
    JobGenius NLP Engine for Resume Parsing and Skill Extraction.
    """
    
    def __init__(self):
        # A list of common tech skills to look for
        self.skills_db = [
            'Python', 'PL/SQL', 'Shell Scripting', 'Bash', 'Prisma Schema Language', 'Deluge',
            'AWS', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Git', 'GitHub', 
            'GitHub Action', 'Grafana', 'AWS RDS', 'EMR', 'AWS S3', 'ETL', 'Databricks', 
            'Data Factory', 'Fabric', 'PySpark', 'NumPy', 'Pandas', 'MySQL', 'MongoDB', 
            'SQLite', 'Supabase', 'Linux', 'Ubuntu', 'Windows', 'IntelliJ IDEA', 'VS Code', 
            'Jupyter Notebook', 'AWS CLI', 'Postman',
            'Java', 'Javascript', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Go', 'Kotlin', 'Rust', 'R',
            'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Webpack',
            'Django', 'Flask', 'FastAPI', 'Node.js', 'Express', 'Spring Boot', 'Laravel', 'Rails', 'ASP.NET',
            'SQL', 'PostgreSQL', 'Redis', 'Oracle', 'MariaDB', 'DynamoDB',
            'GCP', 'CI/CD', 'Ansible',
            'Machine Learning', 'Deep Learning', 'AI', 'NLP', 'TensorFlow', 'PyTorch', 'Scikit-learn',
            'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI', 'Spark', 'Hadoop',
            'GraphQL', 'REST API', 'Microservices', 'Agile', 'Scrum', 'Figma', 'UI/UX', 'SEO', 'Mobile Development',
            'SwiftUI', 'Flutter', 'React Native', 'Firebase', 'Solidity', 'Blockchain'
        ]
        self.matcher = None

    def _get_matcher(self):
        if self.matcher is None:
            from spacy.matcher import PhraseMatcher
            nlp = get_nlp()
            self.matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
            patterns = [nlp.make_doc(skill) for skill in self.skills_db]
            self.matcher.add("SKILLS", patterns)
        return self.matcher

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
        nlp = get_nlp()
        doc = nlp(text)
        matcher = self._get_matcher()
        matches = matcher(doc)
        
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
