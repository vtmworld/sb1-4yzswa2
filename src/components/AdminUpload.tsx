import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

export const AdminUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          // In a real application, you would:
          // 1. Validate the CSV structure
          // 2. Send to your backend API
          // 3. Update the jobs.csv file on your server
          
          console.log('Parsed CSV:', results.data);
          alert('CSV uploaded successfully! In a real application, this would update the jobs database.');
          navigate('/');
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setUploading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CSV');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Jobs
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Jobs CSV</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload your jobs CSV file
            </label>
            
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">CSV files only</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">CSV Format Requirements:</h2>
            <p className="text-sm text-gray-600 mb-4">
              Your CSV file should include the following columns:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>id (unique identifier)</li>
              <li>title (job title)</li>
              <li>company (company name)</li>
              <li>location (job location)</li>
              <li>type (FULL_TIME, PART_TIME, CONTRACT, or FREELANCE)</li>
              <li>description (job description)</li>
              <li>requirements (one per line)</li>
              <li>salaryMin (minimum salary)</li>
              <li>salaryMax (maximum salary)</li>
              <li>salaryCurrency (USD, EUR, etc.)</li>
              <li>postedDate (YYYY-MM-DD)</li>
              <li>applicationUrl (URL for job application)</li>
              <li>companyLogo (URL to company logo image)</li>
            </ul>
          </div>

          <div className="mt-4">
            <a
              href="/jobs.csv"
              download
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Download current jobs CSV as template
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};