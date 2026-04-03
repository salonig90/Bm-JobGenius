from jobspy import scrape_jobs
import pandas as pd

class JobFetcher:
    """
    JobFetcher using python-jobspy to fetch LIVE job postings from
    LinkedIn, Indeed, Glassdoor, and Google.
    Supports India, Global and Remote job discovery.
    """

    def fetch_live_jobs(self, search_term, location="India", results_count=20):
        """
        Scrapes jobs from major boards and returns them as a list of dicts.
        Restricted to Indian jobs only from LinkedIn, Indeed, Glassdoor, and Google.
        """
        all_jobs = []
        
        # Site priority list - focusing on India-friendly sites
        sites = ["linkedin", "google", "indeed", "glassdoor"]

        # --- Fetch jobs per site to avoid one failure blocking all ---
        for site in sites:
            try:
                print(f"JobSpy: Fetching from {site} for '{search_term}' in {location}...")
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
                    # Add site name to each record if not present
                    jobs_dict = jobs.to_dict('records')
                    for j in jobs_dict:
                        if 'site' not in j:
                            j['site'] = site
                    all_jobs += jobs_dict
                    print(f"JobSpy {site}: fetched {len(jobs)} jobs")
            except Exception as e:
                print(f"JobSpy {site} fetch failed: {e}")

        print(f"JobFetcher total: {len(all_jobs)} live jobs fetched from India")
        return all_jobs

# Singleton instance
fetcher = JobFetcher()
