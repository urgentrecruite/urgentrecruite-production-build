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
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function getSupabaseClient() {
  return window.urgentRecruiteSupabase || null;
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : null;
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

function generateVacancyBrief() {
  const data = new FormData(applicationForm);
  const industry = data.get("industry") || "the relevant industry";
  const jobTitle = data.get("jobTitle") || "the open role";
  const yearsRequired = data.get("yearsRequired") || "relevant experience";
  const annualPay = data.get("annualPay") || "competitive compensation";
  const jobDescription = data.get("jobDescription") || "The organization is seeking a capable professional to support key business goals, collaborate with stakeholders, and deliver high-quality work.";
  const jobSpecification = data.get("jobSpecification") || "Strong communication, ownership, technical or functional competence, problem-solving ability, and readiness to contribute quickly.";

  generatedBrief.value = [
    `Job Description: ${jobTitle}`,
    "",
    `We are hiring for ${jobTitle} within ${industry}. The ideal candidate will bring ${yearsRequired}, strong ownership, and the ability to contribute in a fast-moving environment. The role offers ${annualPay} and will focus on delivering measurable value across the responsibilities described by the hiring team.`,
    "",
    "Role Summary",
    jobDescription,
    "",
    "Candidate Specification",
    jobSpecification,
    "",
    "Shortlist Criteria",
    "- Demonstrated experience aligned with the role and industry.",
    "- Clear communication and stakeholder management ability.",
    "- Evidence of delivery, accountability, and readiness to interview.",
    "- Compensation and availability fit with the organization's expectations.",
    "",
    "Shareable Social Summary",
    `UrgentRecruite is supporting a ${industry} organization hiring for ${jobTitle}. Qualified candidates with ${yearsRequired} are invited to express interest for a confidential shortlist review.`
  ].join("\n");

  showToast("Generated vacancy brief added");
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
    contact_details: [payload.email, payload.phone, payload.linkedin].filter(Boolean).join(" / "),
    notes: cvUpload.name ? `Uploaded file: ${cvUpload.name}` : "Submitted from landing page",
    cv_file_name: cvUpload.name,
    cv_file_path: cvUpload.path
  });

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
  const formData = new FormData(applicationForm);
  const payload = toPayload(applicationForm);
  const isShortlist = payload.source === "shortlist";
  const endpoint = isShortlist ? CONFIG.shortlistEndpoint : CONFIG.profileEndpoint;
  const storageKey = isShortlist ? "urgentRecruiteShortlistRequests" : "urgentRecruiteProfiles";

  try {
    const savedToSupabase = await saveApplicationToSupabase(formData, payload);
    if (!savedToSupabase) {
      await postOrStore(endpoint, payload, storageKey);
    }
    formDialog.close();
    showToast(isShortlist ? "Hiring request submitted." : "Profile submitted.");
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
