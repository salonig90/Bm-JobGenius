import os
import django

# Setup Django Environment
import sys
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobgenius_config.settings')
django.setup()

from jobs.models import Job

def seed_data():
    sample_jobs = [
        {
            "title": "Senior Python Developer",
            "company": "TechInnovate",
            "location": "Remote",
            "description": "We are looking for a Senior Python Developer with strong Django and SQL skills to build scalable backend systems.",
            "source": "Seed"
        },
        {
            "title": "Frontend React Engineer",
            "company": "Creative Solutions",
            "location": "San Francisco, CA",
            "description": "Join our team to build high-performance React components using Vite, TypeScript, and modern CSS frameworks.",
            "source": "Seed"
        },
        {
            "title": "Machine Learning Engineer",
            "company": "AI Forge",
            "location": "New York, NY",
            "description": "Develop and deploy deep learning models using PyTorch, TensorFlow, and Scikit-learn for our recommendation engine.",
            "source": "Seed"
        },
        {
            "title": "Data Scientist",
            "company": "Insight Data Labs",
            "location": "Austin, TX",
            "description": "Analyze complex datasets and create insights using Python, R, the Pandas library, and SQL.",
            "source": "Seed"
        },
        {
            "title": "DevOps Engineer",
            "company": "CloudFlow",
            "location": "Seattle, WA",
            "description": "Manage our AWS infrastructure using Docker, Kubernetes, and CI/CD pipelines with Jenkins.",
            "source": "Seed"
        },
        {
            "title": "Full Stack Developer",
            "company": "Launchpad Startup",
            "location": "Remote",
            "description": "Dynamic role requiring React frontend and Django backend skills. Experience with PostgreSQL is a plus.",
            "source": "Seed"
        },
        {
            "title": "Backend API Developer",
            "company": "Fintech Global",
            "location": "Chicago, IL",
            "description": "Focus on high-security FastAPI development and Redis caching for our financial dashboard.",
            "source": "Seed"
        },
        {
            "title": "UI/UX Designer",
            "company": "Pixels & Pixels",
            "location": "Los Angeles, CA",
            "description": "Create stunning user interfaces with Figma and help with early-stage prototyping with HTML/CSS.",
            "source": "Seed"
        },
        {
            "title": "Software Quality Assurance",
            "company": "BugFree Systems",
            "location": "Remote",
            "description": "Automate testing workflows using Selenium and pytest to ensure our web applications are robust.",
            "source": "Seed"
        },
        {
            "title": "Cloud Solutions Architect",
            "company": "Enterprise Cloud",
            "location": "Boston, MA",
            "description": "Design secure and cost-efficient cloud architectures on GCP and Azure for corporate clients.",
            "source": "Seed"
        },
        {
            "title": "iOS Developer",
            "company": "Mobile First",
            "location": "Denver, CO",
            "description": "Build high-performance mobile apps using Swift and SwiftUI for our global user base.",
            "source": "Seed"
        },
        {
            "title": "Blockchain Engineer",
            "company": "CryptoHub",
            "location": "Miami, FL",
            "description": "Implement secure smart contracts using Solidity on Ethereum and other modern chain protocols.",
            "source": "Seed"
        },
        {
            "title": "Java Systems Engineer",
            "company": "Legacy Systems Corp",
            "location": "Houston, TX",
            "description": "Maintain and optimize large-scale enterprise Java applications using Spring Boot and Hibernate.",
            "source": "Seed"
        },
        {
            "title": "Product Manager (Tech)",
            "company": "Visionary Tech",
            "location": "Remote",
            "description": "Lead cross-functional teams to build the next generation of AI-driven productivity tools. Requirements: Agile, Scrum, Jira.",
            "source": "Seed"
        },
        {
            "title": "Cybersecurity Specialist",
            "company": "SafeNet Defense",
            "location": "Washington, D.C.",
            "description": "Protect our critical infrastructure by performing penetration tests and ensuring compliance with modern security standards.",
            "source": "Seed"
        }
    ]

    for job_data in sample_jobs:
        Job.objects.get_or_create(
            title=job_data["title"],
            company=job_data["company"],
            defaults={
                "location": job_data["location"],
                "description": job_data["description"],
                "source": job_data["source"]
            }
        )
    print(f"Successfully seeded {len(sample_jobs)} jobs.")

if __name__ == "__main__":
    seed_data()
