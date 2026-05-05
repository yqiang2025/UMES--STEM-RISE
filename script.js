const form = document.querySelector("#registrationForm");
const statusEl = document.querySelector("#formStatus");
const confirmation = document.querySelector("#confirmation");
const confirmationText = document.querySelector("#confirmationText");
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

function downloadApplication(application) {
  const payload = JSON.stringify(application, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${application.confirmationId}.json`;
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

  confirmation.hidden = false;
  confirmationText.textContent = `${latestApplication.firstName}, your registration has been prepared. Confirmation number: ${latestApplication.confirmationId}.`;
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
