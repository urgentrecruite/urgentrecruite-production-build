const CONFIG = {
  profileEndpoint: "",
  shortlistEndpoint: "",
  contactEndpoint: "",
  adminUrl: "../index.html"
};

const formDialog = document.querySelector("#form-dialog");
const applicationForm = document.querySelector("#application-form");
const candidateFields = document.querySelector("#candidate-fields");
const shortlistFields = document.querySelector("#shortlist-fields");
const sourceInput = document.querySelector("#submission-source");
const formTitle = document.querySelector("#form-title");
const formDescription = document.querySelector("#form-description");
const formEyebrow = document.querySelector("#form-eyebrow");
const salaryField = document.querySelector("#salary-field");
const summaryLabel = document.querySelector("#summary-label");
const summaryTextarea = document.querySelector("#summary-textarea");
const submitButton = document.querySelector("#submit-form");
const menuButton = document.querySelector("#menu-button");
const siteHeader = document.querySelector(".site-header");
const generateBriefButton = document.querySelector("#generate-brief");
const generatedBrief = document.querySelector("#generated-brief");
const toast = document.querySelector("#toast");
const previousStepButton = document.querySelector("#previous-step");
const nextStepButton = document.querySelector("#next-step");
const formProgress = document.querySelector("#form-progress");
const countryInput = document.querySelector("#country-input");
const phoneInput = document.querySelector("#phone-input");
const summaryWordCount = document.querySelector("#summary-word-count");

let currentFormStep = 1;
let currentFormType = "cv";

const minimumProfileWords = 200;

const countries = [
  { name: "Nigeria", dialCode: "+234" },
  { name: "Spain", dialCode: "+34" },
  { name: "Portugal", dialCode: "+351" },
  { name: "United States", dialCode: "+1" },
  { name: "United Kingdom", dialCode: "+44" },
  { name: "Canada", dialCode: "+1" },
  { name: "Ghana", dialCode: "+233" },
  { name: "Kenya", dialCode: "+254" },
  { name: "South Africa", dialCode: "+27" },
  { name: "Ireland", dialCode: "+353" },
  { name: "France", dialCode: "+33" },
  { name: "Germany", dialCode: "+49" },
  { name: "Netherlands", dialCode: "+31" },
  { name: "Italy", dialCode: "+39" },
  { name: "United Arab Emirates", dialCode: "+971" }
];

const experienceFields = [
  "Accounting and Finance",
  "Administration",
  "Agriculture",
  "Architecture",
  "Business Development",
  "Customer Success",
  "Data Analysis",
  "Digital Marketing",
  "Education",
  "Engineering",
  "Executive Leadership",
  "Healthcare",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Logistics and Supply Chain",
  "Operations",
  "Product Management",
  "Project Management",
  "Sales",
  "Software Engineering"
];

const experienceYears = [
  "Internship / entry level",
  "1+ years",
  "2+ years",
  "3+ years",
  "5+ years",
  "7+ years",
  "10+ years",
  "15+ years"
];

const industries = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Education",
  "Energy",
  "Logistics",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Legal",
  "Public Sector",
  "Non-profit",
  "Media and Creative",
  "Real Estate",
  "Professional Services"
];

const formCopy = {
  cv: {
    eyebrow: "Candidate profile",
    title: "Submit My CV",
    description: "Tell us about yourself so we can get your profile in front of the right organizations.",
    button: "Submit Profile"
  },
  intent: {
    eyebrow: "Internship application",
    title: "I want to Intern",
    description: "Share your background and preferred department so we can match you with internship opportunities.",
    button: "Submit Internship Profile"
  },
  shortlist: {
    eyebrow: "Hiring request",
    title: "Request a Shortlist",
    description: "Tell us what you need and our team will prepare a verified shortlist tailored to your vacancy.",
    button: "Submit Hiring Request"
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 5200);
}

function getSupabaseClient() {
  return window.urgentRecruiteSupabase || null;
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function formatUsd(value) {
  const amount = parseMoney(value);
  if (!amount) return "competitive compensation";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function countWords(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function populateDatalist(id, values) {
  const list = document.querySelector(`#${id}`);
  list.innerHTML = values
    .map((value) => typeof value === "string" ? value : value.name)
    .map((value) => `<option value="${value}"></option>`)
    .join("");
}

function getCountryMeta(name) {
  const normalized = String(name || "").trim().toLowerCase();
  return countries.find((country) => country.name.toLowerCase() === normalized) || null;
}

function updatePhoneForCountry() {
  const country = getCountryMeta(countryInput.value);
  const dialCode = country?.dialCode || "+1";
  phoneInput.placeholder = `${dialCode} phone number`;

  if (!phoneInput.value.trim()) {
    phoneInput.value = `${dialCode} `;
  }
}

function updateWordCount() {
  const words = countWords(summaryTextarea.value);
  summaryWordCount.textContent = `${words} / ${minimumProfileWords} words minimum`;
  summaryWordCount.classList.toggle("valid", words >= minimumProfileWords);
}

function getVisibleStepFields() {
  return applicationForm.querySelectorAll(`[data-step]`);
}

function setFormStep(step) {
  currentFormStep = Math.min(3, Math.max(1, step));

  getVisibleStepFields().forEach((field) => {
    field.classList.toggle("step-hidden", Number(field.dataset.step) !== currentFormStep);
  });

  formProgress.querySelectorAll("span").forEach((item, index) => {
    const stepNumber = index + 1;
    item.classList.toggle("active", stepNumber === currentFormStep);
    item.classList.toggle("complete", stepNumber < currentFormStep);
  });

  previousStepButton.hidden = currentFormStep === 1;
  nextStepButton.hidden = currentFormStep === 3;
  submitButton.hidden = currentFormStep !== 3;
}

function resetFormSteps() {
  currentFormStep = 1;
  setFormStep(1);
  updateWordCount();
}

function hasUploadedFile(file) {
  return file instanceof File && Boolean(file.name);
}

function sanitizeFileName(fileName) {
  return String(fileName || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadSupabaseFile(file, bucket, folder) {
  if (!hasUploadedFile(file)) return { path: "", name: "" };

  const client = getSupabaseClient();
  if (!client) return { path: "", name: file.name };

  const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) throw error;
  return { path: data.path, name: file.name };
}

function openForm(type) {
  const selected = formCopy[type] || formCopy.cv;
  currentFormType = type;
  sourceInput.value = type;
  formEyebrow.textContent = selected.eyebrow;
  formTitle.textContent = selected.title;
  formDescription.textContent = selected.description;
  submitButton.textContent = selected.button;

  const isShortlist = type === "shortlist";
  const isIntent = type === "intent";
  candidateFields.classList.toggle("hidden", isShortlist);
  shortlistFields.classList.toggle("hidden", !isShortlist);
  salaryField.classList.toggle("hidden", isIntent);
  summaryLabel.textContent = isIntent ? "Note for us" : "Career Interests";
  summaryTextarea.placeholder = isIntent
    ? "Write a short note for us about your preferred department, field, or internship goals..."
    : "Write a short note about yourself...";
  applicationForm.reset();
  sourceInput.value = type;
  updatePhoneForCountry();
  resetFormSteps();
  formDialog.showModal();
}

function toPayload(form) {
  const data = new FormData(form);
  const payload = {
    submittedAt: new Date().toISOString(),
    source: data.get("source")
  };

  data.forEach((value, key) => {
    if (value instanceof File) {
      payload[key] = value.name || "";
    } else {
      payload[key] = value;
    }
  });

  return payload;
}

function updateMenuState(isOpen) {
  siteHeader.classList.toggle("open", isOpen);
  menuButton.textContent = isOpen ? "Close menu" : "Menu";
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function sentenceCaseList(value, fallback) {
  return String(value || fallback)
    .split(/\n|;|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 7);
}

function bulletList(items) {
  return items.map((item) => `- ${item.replace(/^[-*]\s*/, "")}`).join("\n");
}

function generateVacancyBrief() {
  const data = new FormData(applicationForm);
  const companyName = data.get("companyName") || "Our organization";
  const industry = data.get("industry") || "the relevant industry";
  const jobTitle = data.get("jobTitle") || "the open role";
  const yearsRequired = data.get("yearsRequired") || "relevant experience";
  const annualPay = formatUsd(data.get("annualPay"));
  const jobDescription = data.get("jobDescription") || "Own key responsibilities, collaborate with cross-functional stakeholders, improve team execution, and deliver measurable outcomes.";
  const jobSpecification = data.get("jobSpecification") || "Strong communication, ownership, analytical thinking, role-specific competence, and readiness to contribute quickly.";
  const uploadedDocument = data.get("jobDocument");
  const sourceNote = hasUploadedFile(uploadedDocument)
    ? `\n\nSource note: This advert should also be reviewed against the uploaded document "${uploadedDocument.name}" before publishing.`
    : "";

  const responsibilities = sentenceCaseList(jobDescription, jobDescription);
  const requirements = sentenceCaseList(jobSpecification, jobSpecification);

  generatedBrief.value = [
    `${companyName} is hiring: ${jobTitle}`,
    "",
    `About the role`,
    `${companyName} is looking for a ${jobTitle} to join its ${industry} team. This role is designed for a high-ownership professional with ${yearsRequired}, sound judgement, and the ability to turn business priorities into consistent execution. The compensation basis shared for this role is ${annualPay}.`,
    "",
    "What you will do",
    bulletList(responsibilities),
    "",
    "What we are looking for",
    bulletList(requirements),
    "",
    "Ideal candidate profile",
    `The strongest candidates will show clear evidence of relevant ${industry} experience, practical delivery in a comparable ${jobTitle} role, strong communication, and the maturity to operate with minimal hand-holding. They should be able to explain what they have built, improved, led, or delivered in previous roles.`,
    "",
    "LinkedIn advert summary",
    `${companyName} is hiring a ${jobTitle}. If you have ${yearsRequired}, a strong track record in ${industry}, and the ability to deliver with clarity and ownership, we would like to hear from you.`,
    sourceNote
  ].join("\n");

  showToast("Professional advert generated. Review it against the role details before publishing.");
}

async function postOrStore(endpoint, payload, storageKey) {
  if (!endpoint) {
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existing.push(payload);
    localStorage.setItem(storageKey, JSON.stringify(existing));
    return { storedLocally: true };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return response.json().catch(() => ({}));
}

async function saveApplicationToSupabase(formData, payload) {
  const client = getSupabaseClient();
  if (!client) return false;

  if (payload.source === "shortlist") {
    const documentUpload = await uploadSupabaseFile(formData.get("jobDocument"), "job-documents", "shortlist-requests");
    const { error } = await client.from("shortlist_requests").insert({
      organization: payload.companyName || "Unnamed organization",
      contact_name: payload.contactName || "",
      work_email: payload.workEmail || "",
      company_linkedin: payload.companyLinkedin || "",
      industry: payload.industry || "",
      job_title: payload.jobTitle || "Shortlist request",
      years_required: payload.yearsRequired || "",
      annual_gross_pay: parseMoney(payload.annualPay),
      job_description: payload.jobDescription || "",
      job_specification: payload.jobSpecification || "",
      generated_brief: payload.generatedBrief || "",
      job_document_name: documentUpload.name,
      job_document_path: documentUpload.path
    });

    if (error) throw error;
    return true;
  }

  const cvUpload = await uploadSupabaseFile(formData.get("cvFile"), "candidate-cvs", "profiles");
  const { error } = await client.from("profiles").insert({
    full_name: payload.fullName || "Unnamed candidate",
    email: payload.email || "",
    phone: payload.phone || "",
    linkedin: payload.linkedin || "",
    role: payload.field || "Candidate profile",
    location: payload.country || "",
    experience: payload.experience || "",
    expected_salary: payload.source === "intent" ? "" : payload.salary || "",
    skills: [payload.field || "General profile"].filter(Boolean),
    source: payload.source === "intent" ? "intent" : "cv",
    summary: payload.summary || "",
    word_count: countWords(payload.summary),
    contact_details: [payload.email, payload.phone, payload.linkedin].filter(Boolean).join(" / "),
    notes: cvUpload.name ? `Uploaded file: ${cvUpload.name}` : "Submitted from landing page",
    cv_file_name: cvUpload.name,
    cv_file_path: cvUpload.path
  });

  if (error) throw error;
  return true;
}

async function saveDeletedProfileToSupabase(payload, reason) {
  const client = getSupabaseClient();
  const deletedProfile = {
    full_name: payload.fullName || "Unnamed candidate",
    email: payload.email || "",
    phone: payload.phone || "",
    linkedin: payload.linkedin || "",
    role: payload.field || "Candidate profile",
    location: payload.country || "",
    experience: payload.experience || "",
    source: payload.source === "intent" ? "intent" : "cv",
    summary: payload.summary || "",
    word_count: countWords(payload.summary),
    contact_details: [payload.email, payload.phone, payload.linkedin].filter(Boolean).join(" / "),
    notes: payload.cvFile ? `Uploaded file: ${payload.cvFile}` : "Submission did not meet profile detail threshold.",
    deletion_reason: reason,
    delete_after: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  };

  if (!client) {
    const existing = JSON.parse(localStorage.getItem("urgentRecruiteDeletedProfiles") || "[]");
    existing.push({ ...deletedProfile, submittedAt: new Date().toISOString() });
    localStorage.setItem("urgentRecruiteDeletedProfiles", JSON.stringify(existing));
    return true;
  }

  const { error } = await client.from("deleted_profiles").insert(deletedProfile);
  if (error) throw error;
  return true;
}

async function saveContactToSupabase(payload) {
  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client.from("contact_requests").insert({
    full_name: payload.name || "",
    email: payload.email || "",
    phone: payload.phone || "",
    message: payload.message || ""
  });

  if (error) throw error;
  return true;
}

document.querySelectorAll("[data-form]").forEach((button) => {
  button.addEventListener("click", () => openForm(button.dataset.form));
});

populateDatalist("country-options", countries);
populateDatalist("experience-field-options", experienceFields);
populateDatalist("experience-year-options", experienceYears);
populateDatalist("industry-options", industries);

countryInput.addEventListener("input", updatePhoneForCountry);
summaryTextarea.addEventListener("input", updateWordCount);

previousStepButton.addEventListener("click", () => setFormStep(currentFormStep - 1));
nextStepButton.addEventListener("click", () => setFormStep(currentFormStep + 1));

document.querySelector("#cancel-form").addEventListener("click", () => {
  formDialog.close();
});

menuButton.addEventListener("click", () => {
  updateMenuState(!siteHeader.classList.contains("open"));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => updateMenuState(false));
});

generateBriefButton.addEventListener("click", generateVacancyBrief);

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (currentFormStep < 3) {
    setFormStep(currentFormStep + 1);
    return;
  }

  const formData = new FormData(applicationForm);
  const payload = toPayload(applicationForm);
  const isShortlist = payload.source === "shortlist";
  const endpoint = isShortlist ? CONFIG.shortlistEndpoint : CONFIG.profileEndpoint;
  const storageKey = isShortlist ? "urgentRecruiteShortlistRequests" : "urgentRecruiteProfiles";

  try {
    if (!isShortlist && countWords(payload.summary) < minimumProfileWords) {
      await saveDeletedProfileToSupabase(payload, "Less than 200 written profile words");
      formDialog.close();
      showToast("Thanks for submitting. This profile needs at least 200 written words, so it was moved to the review bucket instead of the active shortlist pool.");
      return;
    }

    const savedToSupabase = await saveApplicationToSupabase(formData, payload);
    if (!savedToSupabase) {
      await postOrStore(endpoint, payload, storageKey);
    }
    formDialog.close();
    showToast(isShortlist
      ? "Hiring request received. Our team will review the role details and prepare your shortlist workflow."
      : "Profile submitted successfully. It is now ready for recruiter review in the admin dashboard.");
  } catch (error) {
    showToast("Could not submit yet. Please check Supabase setup.");
  }
});

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = toPayload(event.currentTarget);

  try {
    const savedToSupabase = await saveContactToSupabase(payload);
    if (!savedToSupabase) {
      await postOrStore(CONFIG.contactEndpoint, payload, "urgentRecruiteContactRequests");
    }
    event.currentTarget.reset();
    showToast("Callback request received.");
  } catch (error) {
    showToast("Could not submit contact request yet.");
  }
});

window.urgentRecruiteConfig = CONFIG;
