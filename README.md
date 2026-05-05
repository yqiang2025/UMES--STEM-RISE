# STEM-RISE Student Application Website

This is a static GitHub-ready website for the STEM-RISE summer internship application.

## Included Features

- Student-facing STEM-RISE landing page
- Online application form
- Pharmacy included in STEM area of interest
- Google Sheets submission through Google Apps Script
- Hidden admin/local record sections so students only see the application page
- UMES logo and lab background images
- Download/print copy option for applicants
- Email record option for the program coordinator

## Project Structure

```text
stem-rise-final-github/
├── index.html
├── styles.css
├── script.js
├── README.md
├── .gitignore
├── assets/
│   ├── stem-rise-hero.png
│   └── umes-logo.png
└── appscript/
    └── Code.gs
```

## Google Sheets Setup

1. Create a Google Sheet.
2. Add a tab named `Applications`.
3. Open **Extensions > Apps Script**.
4. Paste the contents of `appscript/Code.gs`.
5. Save.
6. Run `testAppendRow` once to approve permissions and confirm the sheet receives rows.
7. Go to **Deploy > Manage deployments > Edit**.
8. Choose **New version**.
9. Use:
   - **Execute as:** Me
   - **Who has access:** Anyone, or Anyone within UMES if all applicants are signed into UMES
10. Deploy and copy the Web App URL ending in `/exec`.
11. Paste the URL into `GOOGLE_SHEETS_WEB_APP_URL` in `script.js`.

The current `script.js` already contains the UMES Apps Script URL provided during setup.

## GitHub Pages Deployment

1. Upload these files to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /root
4. Save.
5. GitHub will publish the site and provide a public URL.

## Important

If you change `Code.gs`, saving is not enough. You must deploy a **new version** of the Apps Script Web App.


## Outlook Email Completion Notice

This GitHub/custom-form version includes an **Email Completion Notice** button after the student submits the website form.

The button opens Outlook on the web with:
- Coordinator email pre-filled as vhsia@umes.edu
- Subject pre-filled
- Student application details included in the email body



## Submit Button Email Behavior

In this version, the main **Submit Application and Open Email** button opens Outlook directly after the student submits the website form.

There is no separate Email Record button. The Outlook message is addressed only to `vhsia@umes.edu`.
