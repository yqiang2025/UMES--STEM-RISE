function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Applications");
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.id,
    data.submittedAt,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.studentId,
    data.department,
    data.major,
    data.year,
    data.gpa,
    data.graduationTerm,
    data.stemArea,
    data.mentor,
    data.researchInterest,
    data.goals,
    data.housingNeeded,
    data.mealPlanNeeded
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput("STEM-RISE Google Sheets sync is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
