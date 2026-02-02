# Simple-CRM
Simple CRM

This repo is a template.
Each client must deploy their own Google Apps Script and paste their own Web App URL into script.js.

Lead Intake → Google Sheets (Simple CRM) v2

This package is designed to be hard to break:
- Front-end always shows a useful error message if something is wrong
- Back-end returns spreadsheetUrl + lastRow counts for debugging
- /exec URL supports GET health check (returns OK)

## Step 1 — Make the Google Sheet
Create a Google Sheet. You can start blank.

## Step 2 — Add the Apps Script
Sheet → Extensions → Apps Script
Paste `apps_script.gs` contents.
Replace:
  const SPREADSHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
with your sheet ID (from the sheet URL).

## Step 3 — Deploy as Web App
Deploy → New deployment → Web app
- Execute as: Me
- Who has access: Anyone (or Anyone with link)
Copy the Web App URL (ends in /exec).

IMPORTANT: If you change the script later, you must redeploy as a NEW VERSION.

## Step 4 — Add endpoint to the front-end
Open `script.js` and paste the Web App URL into ENDPOINT.

## Step 5 — Test
Open `lead_intake.html` and submit a test lead.
- If it saved, you'll see “Saved ✅ (…)”
- If it failed, you'll see the error.
Check your Google Sheet for tabs: Leads and Intake.
