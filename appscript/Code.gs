function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("Applications");

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Applications");
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID",
        "Submitted At",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Student ID",
        "Department",
        "Major",
        "Academic Year",
        "GPA",
        "Graduation Term",
        "STEM Area",
        "Mentor",
        "Research Interest",
        "Goals",
        "Housing Needed",
        "Meal Plan Needed",
        "Available Full Program",
        "Mentor Meetings",
        "Final Presentation",
        "Consent"
      ]);
    }

    var rawPayload = "";

    if (e && e.parameter && e.parameter.payload) {
      rawPayload = e.parameter.payload;
    } else if (e && e.postData && e.postData.contents) {
      rawPayload = e.postData.contents;
    }

    if (!rawPayload) {
      throw new Error("No payload was received.");
    }

    var data = JSON.parse(rawPayload);

    sheet.appendRow([
      data.id || "",
      data.submittedAt || "",
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.phone || "",
      data.studentId || "",
      data.department || "",
      data.major || "",
      data.year || "",
      data.gpa || "",
      data.graduationTerm || "",
      data.stemArea || "",
      data.mentor || "",
      data.researchInterest || "",
      data.goals || "",
      data.housingNeeded || "",
      data.mealPlanNeeded || "",
      data.available || false,
      data.mentorMeetings || false,
      data.presentation || false,
      data.consent || false
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testAppendRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Applications");

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Applications");
  }

  sheet.appendRow([
    "TEST-" + new Date().getTime(),
    new Date().toLocaleString(),
    "Test",
    "Student",
    "test@umes.edu",
    "555-555-5555",
    "000000",
    "Pharmacy",
    "Pharmacy",
    "Junior",
    "3.50",
    "Spring 2027",
    "Pharmacy",
    "Test Mentor",
    "Test research interests",
    "Test goals",
    "Unsure",
    "Unsure",
    true,
    true,
    true,
    true
  ]);
}
