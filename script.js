const form = document.querySelector("#registrationForm");
const statusEl = document.querySelector("#formStatus");
const confirmation = document.querySelector("#confirmation");
const confirmationText = document.querySelector("#confirmationText");
const emailButton = document.querySelector("#emailApplication");
const downloadButton = document.querySelector("#downloadApplication");
const newButton = document.querySelector("#newApplication");

let latestApplication = null;

function buildConfirmationId() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `STEM-RISE-${datePart}-${randomPart}`;
}

function getFormData(formElement) {
  const data = new FormData(formElement);
  return {
    confirmationId: buildConfirmationId(),
    submittedAt: new Date().toISOString(),
    firstName: data.get("firstName").trim(),
    lastName: data.get("lastName").trim(),
    email: data.get("email").trim(),
    phone: data.get("phone").trim(),
    studentId: data.get("studentId").trim(),
    department: data.get("department").trim(),
    major: data.get("major").trim(),
    year: data.get("year"),
    gpa: data.get("gpa"),
    stemArea: data.get("stemArea"),
    mentor: data.get("mentor").trim(),
    researchInterest: data.get("researchInterest").trim(),
    goals: data.get("goals").trim(),
    acknowledgements: {
      fullAvailability: data.get("available") === "on",
      mentorMeetings: data.get("mentorMeetings") === "on",
      finalPresentation: data.get("presentation") === "on",
    },
  };
}

function markInvalidFields() {
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.classList.toggle("field-error", !field.checkValidity());
  });
}

function clearInvalidState(event) {
  const field = event.target;
  if (field.matches("input, select, textarea")) {
    field.classList.remove("field-error");
  }
}

function escapePdfText(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function wrapText(text, maxLength = 78) {
  const words = String(text || "Not provided").split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) {
    lines.push(line);
  }

  return lines;
}

function buildPdf(application) {
  const submittedDate = new Date(application.submittedAt).toLocaleString();
  const rows = [
    ["Confirmation", application.confirmationId],
    ["Submitted", submittedDate],
    ["Student Name", `${application.firstName} ${application.lastName}`],
    ["UMES Student ID", application.studentId],
    ["Department", application.department],
    ["Major", application.major],
    ["Academic Year", application.year],
    ["Current GPA", application.gpa],
    ["UMES Email", application.email],
    ["Phone", application.phone],
    ["STEM Area", application.stemArea],
    ["Preferred Mentor", application.mentor || "Not provided"],
    ["Research Interests", application.researchInterest],
    ["Career or Graduate School Goals", application.goals],
    ["Full 10-week Availability", application.acknowledgements.fullAvailability ? "Yes" : "No"],
    ["Routine Mentor Meetings", application.acknowledgements.mentorMeetings ? "Yes" : "No"],
    ["Final Presentation", application.acknowledgements.finalPresentation ? "Yes" : "No"],
  ];

  const content = ["BT", "/F1 18 Tf", "50 760 Td", "(STEM-RISE Registration) Tj", "/F1 10 Tf", "0 -24 Td"];

  rows.forEach(([label, value]) => {
    const wrapped = wrapText(`${label}: ${value}`);
    wrapped.forEach((line) => {
      content.push(`(${escapePdfText(line)}) Tj`);
      content.push("0 -15 Td");
    });
    content.push("0 -5 Td");
  });

  content.push("ET");
  const stream = content.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function buildEmailBody(application) {
  const submittedDate = new Date(application.submittedAt).toLocaleString();
  return [
    "STEM-RISE Registration Record",
    "",
    `Confirmation: ${application.confirmationId}`,
    `Submitted: ${submittedDate}`,
    "",
    `Student Name: ${application.firstName} ${application.lastName}`,
    `UMES Student ID: ${application.studentId}`,
    `Department: ${application.department}`,
    `Major: ${application.major}`,
    `Academic Year: ${application.year}`,
    `Current GPA: ${application.gpa}`,
    `UMES Email: ${application.email}`,
    `Phone: ${application.phone}`,
    "",
    `STEM Area: ${application.stemArea}`,
    `Preferred Mentor: ${application.mentor || "Not provided"}`,
    "",
    "Research Interests:",
    application.researchInterest,
    "",
    "Career or Graduate School Goals:",
    application.goals,
    "",
    "Acknowledgements:",
    `Full 10-week availability: ${application.acknowledgements.fullAvailability ? "Yes" : "No"}`,
    `Routine mentor meetings: ${application.acknowledgements.mentorMeetings ? "Yes" : "No"}`,
    `Final presentation: ${application.acknowledgements.finalPresentation ? "Yes" : "No"}`,
  ].join("\n");
}

function buildMailto(application) {
  const subject = `STEM-RISE Registration - ${application.firstName} ${application.lastName} - ${application.confirmationId}`;
  const body = buildEmailBody(application);
  return `mailto:yqiang@umes.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function downloadApplication(application) {
  const payload = buildPdf(application);
  const blob = new Blob([payload], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${application.confirmationId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

form.addEventListener("input", clearInvalidState);
form.addEventListener("change", clearInvalidState);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusEl.textContent = "";

  if (!form.checkValidity()) {
    markInvalidFields();
    statusEl.textContent = "Please complete the highlighted required fields.";
    form.reportValidity();
    return;
  }

  latestApplication = getFormData(form);
  localStorage.setItem("stemRiseLatestApplication", JSON.stringify(latestApplication));
  emailButton.href = buildMailto(latestApplication);

  confirmation.hidden = false;
  confirmationText.textContent = `${latestApplication.firstName}, your registration has been prepared. Confirmation number: ${latestApplication.confirmationId}. Use Email Record to open a message addressed to yqiang@umes.edu, then send it from your email app.`;
  confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
});

downloadButton.addEventListener("click", () => {
  if (latestApplication) {
    downloadApplication(latestApplication);
  }
});

newButton.addEventListener("click", () => {
  latestApplication = null;
  form.reset();
  confirmation.hidden = true;
  statusEl.textContent = "";
  form.querySelectorAll(".field-error").forEach((field) => field.classList.remove("field-error"));
  document.querySelector("#register").scrollIntoView({ behavior: "smooth", block: "start" });
});
