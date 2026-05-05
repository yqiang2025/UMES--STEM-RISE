// Paste your deployed Google Apps Script Web App URL here.
      // Example: const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzjZ7UJR9VYW0XjjCcKfPSnwNBy4Wmx4x8KYGIu2wE/dev";
      const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQHKkgj9KBaeqQbLa5M4j0KCaN7IYh9YwIjFywMDzdLqlGxddBrrUK9BpxVX1JceyV/dev";

      const coordinatorEmail = "yqiang@umes.edu";
      const form = document.getElementById("registrationForm");
      const formStatus = document.getElementById("formStatus");
      const confirmation = document.getElementById("confirmation");
      const confirmationText = document.getElementById("confirmationText");
      const syncStatus = document.getElementById("syncStatus");
      const emailApplication = document.getElementById("emailApplication");
      const downloadApplication = document.getElementById("downloadApplication");
      const newApplication = document.getElementById("newApplication");
      const exportCsv = document.getElementById("exportCsv");
      const clearRecords = document.getElementById("clearRecords");
      const recordsBody = document.getElementById("recordsBody");

      let latestApplication = null;
      let applications = JSON.parse(localStorage.getItem("stemRiseApplications") || "[]");

      function formToObject(formElement) {
        const data = new FormData(formElement);
        return {
          id: "STEM-RISE-" + Date.now(),
          submittedAt: new Date().toLocaleString(),
          firstName: data.get("firstName") || "",
          lastName: data.get("lastName") || "",
          email: data.get("email") || "",
          phone: data.get("phone") || "",
          studentId: data.get("studentId") || "",
          department: data.get("department") || "",
          major: data.get("major") || "",
          year: data.get("year") || "",
          gpa: data.get("gpa") || "",
          graduationTerm: data.get("graduationTerm") || "",
          stemArea: data.get("stemArea") || "",
          mentor: data.get("mentor") || "",
          researchInterest: data.get("researchInterest") || "",
          goals: data.get("goals") || "",
          housingNeeded: data.get("housingNeeded") || "",
          mealPlanNeeded: data.get("mealPlanNeeded") || "",
          available: data.get("available") === "on",
          mentorMeetings: data.get("mentorMeetings") === "on",
          presentation: data.get("presentation") === "on",
          consent: data.get("consent") === "on"
        };
      }

      function applicationText(app) {
        return [
          "STEM-RISE Student Application",
          "--------------------------------",
          "Application ID: " + app.id,
          "Submitted At: " + app.submittedAt,
          "Name: " + app.firstName + " " + app.lastName,
          "Email: " + app.email,
          "Phone: " + app.phone,
          "UMES Student ID: " + app.studentId,
          "Department: " + app.department,
          "Major: " + app.major,
          "Academic Year: " + app.year,
          "GPA: " + app.gpa,
          "Expected Graduation Term: " + app.graduationTerm,
          "STEM Area: " + app.stemArea,
          "Preferred Mentor: " + app.mentor,
          "Housing Needed: " + app.housingNeeded,
          "Meal Plan Needed: " + app.mealPlanNeeded,
          "",
          "Research Interests:",
          app.researchInterest,
          "",
          "Career or Graduate School Goals:",
          app.goals
        ].join("\n");
      }

      function saveLocal(app) {
        applications.unshift(app);
        localStorage.setItem("stemRiseApplications", JSON.stringify(applications));
        renderRecords();
      }

      async function syncToGoogleSheets(app) {
        const configured = GOOGLE_SHEETS_WEB_APP_URL && !GOOGLE_SHEETS_WEB_APP_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE");

        if (!configured) {
          return "Google Sheets sync is not configured yet. The application was saved locally in this browser.";
        }

        try {
          const body = new URLSearchParams();
          body.append("payload", JSON.stringify(app));

          await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            body: body
          });

          return "Application sent to Google Sheets. If the row does not appear, check the Apps Script deployment permissions and Code.gs.";
        } catch (error) {
          return "The application was saved locally, but Google Sheets sync failed. Check the Web App URL and deployment permissions.";
        }
      }

      function updateEmailLink(app) {
        const subject = encodeURIComponent("STEM-RISE Application: " + app.firstName + " " + app.lastName);
        const body = encodeURIComponent(applicationText(app));
        const outlookUrl =
          "https://outlook.office.com/mail/deeplink/compose" +
          "?to=" + encodeURIComponent(coordinatorEmail) +
          "&subject=" + subject +
          "&body=" + body;

        emailApplication.href = outlookUrl;
        emailApplication.setAttribute("target", "_blank");
        emailApplication.setAttribute("rel", "noopener");
        emailApplication.dataset.outlookUrl = outlookUrl;
      }

      function downloadTextCopy(app) {
        const blob = new Blob([applicationText(app)], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = app.id + "-application.txt";
        link.click();
        URL.revokeObjectURL(url);
      }

      function escapeHtml(value) {
        return String(value || "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function renderRecords() {
        if (!applications.length) {
          recordsBody.innerHTML = '<tr><td colspan="5">No local applications yet.</td></tr>';
          return;
        }

        recordsBody.innerHTML = applications.map((app) => {
          return "<tr>" +
            "<td>" + escapeHtml(app.firstName + " " + app.lastName) + "</td>" +
            "<td>" + escapeHtml(app.email) + "</td>" +
            "<td>" + escapeHtml(app.major) + "</td>" +
            "<td>" + escapeHtml(app.stemArea) + "</td>" +
            "<td>" + escapeHtml(app.submittedAt) + "</td>" +
          "</tr>";
        }).join("");
      }

      function exportApplicationsCsv() {
        if (!applications.length) {
          alert("No applications to export yet.");
          return;
        }

        const headers = [
          "id", "submittedAt", "firstName", "lastName", "email", "phone", "studentId",
          "department", "major", "year", "gpa", "graduationTerm", "stemArea", "mentor",
          "researchInterest", "goals", "housingNeeded", "mealPlanNeeded"
        ];
        const rows = applications.map((app) => headers.map((header) => {
          return '"' + String(app[header] || "").replaceAll('"', '""') + '"';
        }).join(","));
        const csv = headers.join(",") + "\n" + rows.join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "stem-rise-applications.csv";
        link.click();
        URL.revokeObjectURL(url);
      }

      form.addEventListener("submit", async function(event) {
        event.preventDefault();
        formStatus.textContent = "";

        if (!form.checkValidity()) {
          formStatus.textContent = "Please complete all required fields before submitting.";
          form.reportValidity();
          return;
        }

        const app = formToObject(form);
        latestApplication = app;
        saveLocal(app);
        updateEmailLink(app);

        confirmationText.textContent = "Thank you, " + app.firstName + ". Your STEM-RISE application has been prepared with ID " + app.id + ".";
        syncStatus.textContent = "Syncing application...";
        confirmation.hidden = false;
        formStatus.textContent = "Application submitted.";
        confirmation.scrollIntoView({ behavior: "smooth", block: "start" });

        const message = await syncToGoogleSheets(app);
        syncStatus.textContent = message;
        form.reset();
      });
      emailApplication.addEventListener("click", function(event) {
        if (!latestApplication) {
          return;
        }

        event.preventDefault();

        const subject = encodeURIComponent("STEM-RISE Application: " + latestApplication.firstName + " " + latestApplication.lastName);
        const body = encodeURIComponent(applicationText(latestApplication));
        const outlookUrl =
          "https://outlook.office.com/mail/deeplink/compose" +
          "?to=" + encodeURIComponent(coordinatorEmail) +
          "&subject=" + subject +
          "&body=" + body;

        window.open(outlookUrl, "_blank", "noopener");
      });

      downloadApplication.addEventListener("click", function() {
        if (!latestApplication) return;
        downloadTextCopy(latestApplication);
      });

      newApplication.addEventListener("click", function() {
        confirmation.hidden = true;
        formStatus.textContent = "";
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      exportCsv.addEventListener("click", exportApplicationsCsv);

      clearRecords.addEventListener("click", function() {
        if (!confirm("Clear local application records from this browser? This does not affect Google Sheets.")) return;
        applications = [];
        localStorage.removeItem("stemRiseApplications");
        renderRecords();
      });

      renderRecords();
