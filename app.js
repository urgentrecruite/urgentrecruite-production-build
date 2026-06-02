const CONFIG = {
  // Replace this when your backend is ready, for example:
  // profileEndpoint: "https://your-api.com/profiles",
  // shortlistEndpoint: "https://your-api.com/shortlist-requests",
  // contactEndpoint: "https://your-api.com/contact-requests"
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

document.querySelectorAll("[data-form]").forEach((button) => {
  button.addEventListener("click", () => openForm(button.dataset.form));
});

document.querySelector("#cancel-form").addEventListener("click", () => {
  formDialog.close();
});

document.querySelector("#menu-button").addEventListener("click", () => {
  document.querySelector(".site-header").classList.toggle("open");
});

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = toPayload(applicationForm);
  const isShortlist = payload.source === "shortlist";
  const endpoint = isShortlist ? CONFIG.shortlistEndpoint : CONFIG.profileEndpoint;
  const storageKey = isShortlist ? "urgentRecruiteShortlistRequests" : "urgentRecruiteProfiles";

  try {
    await postOrStore(endpoint, payload, storageKey);
    formDialog.close();
    showToast(isShortlist ? "Hiring request submitted." : "Profile submitted. It is ready to send to the admin backend.");
  } catch (error) {
    showToast("Could not submit yet. Please check the backend endpoint.");
  }
});

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = toPayload(event.currentTarget);

  try {
    await postOrStore(CONFIG.contactEndpoint, payload, "urgentRecruiteContactRequests");
    event.currentTarget.reset();
    showToast("Callback request received.");
  } catch (error) {
    showToast("Could not submit contact request yet.");
  }
});

window.urgentRecruiteConfig = CONFIG;
