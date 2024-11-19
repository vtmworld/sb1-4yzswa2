import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Job } from '../types/job';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/jobs.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedJobs = results.data.map((row: any) => ({
              id: row.id,
              title: row.title,
              company: row.company,
              location: row.location,
              type: row.type as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE',
              description: row.description,
              requirements: row.requirements.split('\n'),
              salary: {
                min: parseInt(row.salaryMin),
                max: parseInt(row.salaryMax),
                currency: row.salaryCurrency,
              },
              postedDate: row.postedDate,
              applicationUrl: row.applicationUrl,
              companyLogo: row.companyLogo,
            }));
            setJobs(parsedJobs);
            setLoading(false);
          },
          error: (error) => {
            setError(error.message);
            setLoading(false);
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading, error };
};