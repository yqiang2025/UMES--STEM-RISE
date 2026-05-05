# STEM-RISE Student Application Website

This repository contains a static student application website for **STEM-RISE: Summer Training, Exploration, and Mentored Research Internship for Student Excellence**.

The site is designed for GitHub Pages and includes a student-facing application form that can send each submission to Google Sheets through a Google Apps Script Web App endpoint.

## Files

- `index.html` — main website page
- `styles.css` — website styling
- `script.js` — form validation, submission handling, Google Sheets sync, email record, and printable copy
- `appscript/Code.gs` — Google Apps Script backend for appending submissions to Google Sheets
- `.gitignore` — common files to ignore

## Google Sheets setup

1. Create a Google Sheet named **STEM-RISE Applications**.
2. Create a tab named **Applications**.
3. Add this header row:

```text
ID, Submitted At, First Name, Last Name, Email, Phone, Student ID, Department, Major, Academic Year, GPA, Graduation Term, STEM Area, Mentor, Research Interest, Goals, Housing Needed, Meal Plan Needed
```

4. In Google Sheets, open **Extensions → Apps Script**.
5. Paste the contents of `appscript/Code.gs`.
6. Click **Deploy → New deployment**.
7. Select **Web app**.
8. Set **Execute as** to **Me**.
9. Set **Who has access** to the appropriate setting for your use case. For a public application form, use **Anyone**.
10. Copy the Web App URL ending in `/exec`.
11. In `script.js`, replace the value of `GOOGLE_SHEETS_WEB_APP_URL` with your Web App URL.

This project already includes the Apps Script Web App URL you provided in `script.js`.

## GitHub Pages deployment

1. Create a new GitHub repository, for example `stem-rise-application`.
2. Upload all files in this folder to the repository.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and root folder `/`.
6. Save. GitHub will publish the website and provide a public URL.

## Privacy note

Student application forms can contain sensitive student information. Confirm that your collection method and storage location meet UMES and program requirements before using the site publicly.
