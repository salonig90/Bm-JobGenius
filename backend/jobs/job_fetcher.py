from jobspy import scrape_jobs
import pandas as pd

class JobFetcher:
    """
    JobFetcher using python-jobspy to fetch LIVE job postings from
    LinkedIn, Indeed, Glassdoor, and Google.
    Supports India, Global and Remote job discovery.
    """

    def fetch_live_jobs(self, search_term, location="India", results_count=10):
        """
        Scrapes jobs from major boards and returns them as a list of dicts.
        Optimized to fetch from both Google and LinkedIn in a single call.
        """
        all_jobs = []
        
        # We pass both sites in a single list to let the library handle load balancing
        sites = ["google", "linkedin"]

        try:
            print(f"JobSpy: Fetching from {sites} for '{search_term}' in {location}...")
            
            jobs = scrape_jobs(
                site_name=sites,
                search_term=search_term,
                location=location,
                results_wanted=results_count, 
                hours_old=168, # Last 7 days
                country_shortcut="india", # Force India focus
                linkedin_fetch_description=False # Speeds up LinkedIn fetching
            )
            
            if isinstance(jobs, pd.DataFrame) and not jobs.empty:
                # Clean and format the data
                jobs = jobs.where(pd.notnull(jobs), None)
                all_jobs = jobs.to_dict('records')
                print(f"JobSpy: Total fetched {len(all_jobs)} jobs across sites")
            else:
                print(f"JobSpy: No jobs found across {sites}")
                
        except Exception as e:
            print(f"JobSpy fetch failed: {str(e)}")

        # Deduplicate jobs
        unique_jobs = {}
        for job in all_jobs:
            job_id = job.get('job_url') or f"{job.get('title')}-{job.get('company')}"
            if job_id not in unique_jobs:
                unique_jobs[job_id] = job

        final_jobs = list(unique_jobs.values())
        return final_jobs

# Singleton instance
fetcher = JobFetcher()
