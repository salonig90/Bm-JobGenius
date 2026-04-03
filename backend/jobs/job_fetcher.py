from jobspy import scrape_jobs
import pandas as pd

class JobFetcher:
    """
    JobFetcher using python-jobspy to fetch LIVE job postings from
    LinkedIn, Indeed, Glassdoor, and Google.
    Supports India, Global and Remote job discovery.
    """

    def fetch_live_jobs(self, search_term, location="India", results_count=30):
        """
        Scrapes jobs from major boards and returns them as a list of dicts.
        Restricted to Indian jobs only from LinkedIn, Indeed, Glassdoor, and Google.
        """
        all_jobs = []
        
        # Site priority list - focusing on India-friendly sites
        # We fetch from each site individually to ensure failure in one doesn't stop others
        sites = ["linkedin", "google", "indeed", "glassdoor"]

        for site in sites:
            try:
                print(f"JobSpy: Fetching from {site} for '{search_term}' in {location}...")
                
                # Fetch more than requested per site to ensure we have plenty of variety
                # results_count is the TOTAL we want across all sites, but we fetch up to results_count PER site
                # to maximize the chance of getting a good 20-30 total.
                jobs = scrape_jobs(
                    site_name=[site],
                    search_term=search_term,
                    location=location,
                    results_wanted=results_count, 
                    hours_old=168, # Last 7 days
                    country_shortcut="india", # Force India focus
                    linkedin_fetch_description=(site == "linkedin")
                )
                
                if isinstance(jobs, pd.DataFrame) and not jobs.empty:
                    # Clean and format the data
                    jobs = jobs.where(pd.notnull(jobs), None) # Convert NaN to None for JSON
                    jobs_dict = jobs.to_dict('records')
                    
                    # Track source site
                    for j in jobs_dict:
                        j['site'] = site
                    
                    all_jobs.extend(jobs_dict)
                    print(f"JobSpy {site}: fetched {len(jobs_dict)} jobs")
                else:
                    print(f"JobSpy {site}: No jobs found or returned empty.")
                    
            except Exception as e:
                print(f"JobSpy {site} fetch failed: {str(e)}")

        # Deduplicate jobs by URL or ID if possible
        unique_jobs = {}
        for job in all_jobs:
            # Use job_url or a combination of title/company as key
            job_id = job.get('job_url') or f"{job.get('title')}-{job.get('company')}"
            if job_id not in unique_jobs:
                unique_jobs[job_id] = job

        final_jobs = list(unique_jobs.values())
        print(f"JobFetcher total: {len(final_jobs)} unique live jobs fetched from India across all sites")
        return final_jobs

# Singleton instance
fetcher = JobFetcher()
