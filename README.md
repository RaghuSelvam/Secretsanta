Secret Santa App
Overview
Easily organize your office’s Secret Santa! Upload employee and previous year CSVs, and the app generates random pairings.

How to Use

Upload Files:

Click "Upload Employee CSV" for employee names.
Click "Upload Previous Year CSV" for last year's assignments.
Generate Assignments:

Hit "Generate Secret Santa Assignments" to process the files.
Download Results:

Once ready, download the assignments as a CSV by clicking "Download CSV."
API

POST /upload: Handles file uploads and returns the new pairings in a CSV format.
Request: CSV files for employees and last year's assignments.
Response: CSV string of new assignments.
Tech Stack

React: For UI
Ant Design: UI components
axios: API requests
TypeScript: For clean, safe code