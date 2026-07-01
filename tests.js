const testPackSelect = document.querySelector("#test-pack-select");
const testPackSummary = document.querySelector("#test-pack-summary");
const startTestButton = document.querySelector("#start-test-button");
const testsDiagnostic = document.querySelector("#tests-diagnostic");
const testTitle = document.querySelector("#test-title");
const testProgress = document.querySelector("#test-progress");
const testForm = document.querySelector("#test-form");
const scoreTestButton = document.querySelector("#score-test-button");
const resetTestButton = document.querySelector("#reset-test-button");
const testsReport = document.querySelector("#tests-report");
const testsScoreValue = document.querySelector("#tests-score-value");
const testsScoreLabel = document.querySelector("#tests-score-label");
const testsScoreCopy = document.querySelector("#tests-score-copy");
const testsFeedbackList = document.querySelector("#tests-feedback-list");
const retakeTestButton = document.querySelector("#retake-test-button");
const preInterviewForm = document.querySelector("#pre-interview-form");
const toast = document.querySelector("#toast");

const readinessPacks = [
  {
    id: "it-support",
    industry: "IT & Digital",
    role: "IT Support Specialist",
    level: "Professional",
    summary: "A balanced pack for service desk, IT support, and technical support interviews.",
    competencies: ["Troubleshooting", "Customer support", "Security awareness", "Prioritisation", "Communication"],
    questions: [
      ["Practical scenario", "Troubleshooting", "A user says their laptop connects to Wi-Fi but cannot open any website. Other users are working normally. What is the best first action?", ["Reinstall the wireless driver immediately.", "Check the user's IP/DNS settings and try a known website before escalating.", "Tell the user to wait because the network is probably down.", "Replace the laptop because the browser is not responding."], 1, "Good support starts with targeted diagnosis before costly or disruptive actions."],
      ["Workplace judgement", "Security awareness", "A senior manager asks you to reset a colleague's password because the colleague is travelling. What should you do?", ["Reset it because the request came from a senior manager.", "Share a temporary password with the manager by email.", "Follow identity verification and password reset policy before taking action.", "Ignore the request because password resets are never allowed."], 2, "Identity and access procedures protect both the user and the organization."],
      ["Aptitude", "Prioritisation", "You receive four tickets: CEO cannot join a board meeting, one user wants a new mouse, ten users cannot access email, and a printer is low on toner. Which should be handled first?", ["The new mouse request.", "The printer toner issue.", "The email outage affecting ten users.", "Whichever ticket arrived first."], 2, "Impact and urgency should guide triage."],
      ["Job knowledge", "Technical fundamentals", "Which tool is most directly used to test whether a device can reach another device over the network?", ["ping", "format", "defrag", "rename"], 0, "Ping is a basic connectivity test used in early network diagnosis."],
      ["Interview readiness", "Communication", "In an interview, how should you describe a time you solved a difficult technical issue?", ["Focus only on the tool you used.", "Use situation, task, action, and result, including how you communicated with the user.", "Say the issue was too complex to explain.", "Avoid examples because support work is confidential."], 1, "Structured answers show both technical ability and service maturity."]
    ]
  },
  {
    id: "bank-manager",
    industry: "Banking & Finance",
    role: "Retail Bank Manager",
    level: "Mid Management",
    summary: "A management-readiness pack focused on branch operations, customer escalation, compliance judgement, and team leadership.",
    competencies: ["Compliance", "Customer escalation", "Leadership", "Commercial reasoning", "Ethics"],
    questions: [
      ["Workplace judgement", "Compliance", "An influential customer asks you to override a declined loan decision because they know senior leadership. What is the strongest response?", ["Override it to preserve the relationship.", "Review the process, explain the decision professionally, and escalate only within policy.", "Ask a junior employee to approve it instead.", "Tell the customer the bank never reviews decisions."], 1, "Strong branch leadership balances customer care with compliance."],
      ["Aptitude", "Commercial reasoning", "A branch target is 120 new accounts per month. By day 20, the team has opened 72 accounts. If performance continues at the same pace, what is the likely monthly result over 30 days?", ["96", "108", "120", "144"], 1, "72 accounts in 20 days equals 3.6 per day; over 30 days that is 108."],
      ["Simulation", "Team leadership", "Two high-performing staff members are arguing in front of customers. What should you do first?", ["Address the behaviour privately and restore service coverage immediately.", "Ignore it because both staff members perform well.", "Send both home without understanding the situation.", "Discuss their disagreement in the banking hall."], 0, "Managers must protect customer experience while handling conflict professionally."],
      ["Job knowledge", "Risk awareness", "Which behaviour is most likely to raise anti-money-laundering concern?", ["A customer updates their phone number.", "A customer asks for account statements.", "A customer repeatedly deposits cash just below reporting thresholds.", "A customer requests a debit card replacement."], 2, "Structuring deposits to avoid thresholds is a classic red flag."],
      ["Interview readiness", "Leadership communication", "When asked about branch performance improvement, what answer is strongest?", ["I pushed the team harder until numbers improved.", "I reviewed data, identified conversion gaps, coached staff, and tracked improvement.", "Performance is mostly controlled by head office.", "I avoid discussing figures in interviews."], 1, "Employers listen for diagnosis, action, people leadership, and measurable result."]
    ]
  },
  {
    id: "registered-nurse",
    industry: "Healthcare",
    role: "Registered Nurse",
    level: "Professional",
    summary: "A readiness pack for nursing candidates focused on prioritisation, patient communication, safety, ethics, and interview clarity.",
    competencies: ["Patient safety", "Prioritisation", "Ethics", "Communication", "Documentation"],
    questions: [
      ["Simulation", "Prioritisation", "Four patients need attention: one has sudden chest pain, one needs routine medication, one asks for water, and one has a discharge question. Who should be assessed first?", ["The patient asking for water.", "The patient with sudden chest pain.", "The patient with a discharge question.", "The patient due routine medication."], 1, "Sudden chest pain may indicate urgent deterioration and requires immediate assessment."],
      ["Workplace judgement", "Ethics", "A family member asks for confidential details about an adult patient who has not given consent. What should you do?", ["Share the details because they are family.", "Check consent and follow confidentiality policy.", "Refuse to speak to the family at all.", "Ask another patient what they think."], 1, "Confidentiality and consent are central to safe patient care."],
      ["Job knowledge", "Documentation", "What makes a clinical note strongest?", ["Clear, timely, factual observations and actions taken.", "Personal opinions about the patient.", "Only positive information.", "A note written at the end of the week."], 0, "Safe documentation is timely, factual, and action-focused."],
      ["Aptitude", "Attention to detail", "A medication is prescribed every 8 hours. If the first dose is given at 06:00, when is the third dose due?", ["12:00", "14:00", "18:00", "22:00"], 3, "Dose one is 06:00, dose two is 14:00, and dose three is 22:00."],
      ["Interview readiness", "Communication", "What is the best way to answer a question about handling a distressed patient?", ["Say you are naturally caring and leave it there.", "Describe how you listened, assessed risk, reassured, escalated if needed, and documented.", "Say distressed patients should wait for doctors.", "Avoid examples to protect confidentiality."], 1, "A strong nursing interview answer shows empathy, safety, escalation, and accountability."]
    ]
  },
  {
    id: "project-engineer",
    industry: "Engineering",
    role: "Project Engineer",
    level: "Professional",
    summary: "A project-readiness pack covering safety, planning, stakeholder updates, risk, and practical judgement.",
    competencies: ["Safety", "Planning", "Risk management", "Technical judgement", "Reporting"],
    questions: [
      ["Workplace judgement", "Safety", "A subcontractor wants to continue work after a missing safety guard is discovered because the deadline is tight. What should you do?", ["Allow work to continue and document it later.", "Stop the unsafe activity and follow the safety escalation process.", "Ask the subcontractor to decide.", "Move the work to a less visible area."], 1, "Safety controls are not optional, even under schedule pressure."],
      ["Aptitude", "Planning", "A task takes 6 hours per unit. The team must complete 8 units. With 4 engineers working equally, how many hours of work are needed per engineer?", ["8", "10", "12", "16"], 2, "Total work is 48 hours; divided by 4 engineers equals 12 hours each."],
      ["Simulation", "Risk management", "A supplier delay threatens a key milestone. What is the best first response?", ["Wait until the deadline is missed.", "Assess impact, identify alternatives, update stakeholders, and revise the plan.", "Blame procurement in the next meeting.", "Remove the milestone from the report."], 1, "Project engineers are expected to quantify risk and communicate early."],
      ["Job knowledge", "Technical judgement", "Why is a method statement important before high-risk work?", ["It replaces supervision.", "It describes the safe system of work and planned controls.", "It is only needed after an incident.", "It is mainly for marketing."], 1, "Method statements help teams understand the planned safe approach."],
      ["Interview readiness", "Reporting", "When asked about a project problem you solved, what should your answer include?", ["Only the final result.", "Context, constraints, options considered, action taken, stakeholder update, and result.", "A complaint about the client.", "Technical jargon without business impact."], 1, "Strong engineering candidates connect technical action with delivery impact."]
    ]
  },
  {
    id: "hotel-front-office",
    industry: "Hospitality",
    role: "Hotel Front Office Supervisor",
    level: "Supervisory",
    summary: "A hospitality readiness pack covering guest recovery, shift coordination, service judgement, numeracy, and interview confidence.",
    competencies: ["Guest experience", "Service recovery", "Shift coordination", "Commercial awareness", "Communication"],
    questions: [
      ["Workplace judgement", "Service recovery", "A guest arrives and their prepaid room is not available due to an overbooking error. What is the best response?", ["Tell the guest there is nothing you can do.", "Apologise, take ownership, offer a practical solution, and escalate according to policy.", "Blame the booking system.", "Ask the guest to call the website they used."], 1, "Hospitality supervisors must recover service quickly and professionally."],
      ["Aptitude", "Commercial awareness", "A hotel has 80 rooms and 68 are occupied. What is the occupancy rate?", ["68%", "75%", "80%", "85%"], 3, "68 divided by 80 equals 0.85, or 85%."],
      ["Simulation", "Shift coordination", "Two receptionists call in sick before a busy checkout period. What should you do first?", ["Review demand, reassign trained staff, inform management, and prioritise guest-facing coverage.", "Close reception until later.", "Ask housekeeping to handle all payments without training.", "Cancel checkouts."], 0, "Supervisors need to protect service continuity while escalating resource gaps."],
      ["Job knowledge", "Guest experience", "Which metric is most directly linked to guest satisfaction after a stay?", ["Guest review score or satisfaction survey result.", "Number of staff uniforms ordered.", "Office stationery usage.", "Kitchen stock count only."], 0, "Guest reviews and satisfaction surveys are direct signals of experience quality."],
      ["Interview readiness", "Communication", "How should you answer a question about an angry guest?", ["Say you never get angry guests.", "Describe how you listened, acknowledged the issue, acted within policy, followed up, and learned from it.", "Say security handles all complaints.", "Focus only on how difficult the guest was."], 1, "A strong answer shows calm, ownership, policy awareness, and service recovery."]
    ]
  }
].map((pack) => ({
  ...pack,
  questions: pack.questions.map(([type, competency, text, options, answer, feedback]) => ({ type, competency, text, options, answer, feedback }))
}));

let activeReadinessPack = readinessPacks[0];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 5200);
}

function getPackLabel(pack) {
  return `${pack.industry} - ${pack.role} (${pack.level})`;
}

function getSelectedPack() {
  return readinessPacks.find((pack) => pack.id === testPackSelect?.value) || readinessPacks[0];
}

function syncPreInterviewFields(pack) {
  if (!preInterviewForm || !pack) return;
  const role = preInterviewForm.elements.targetRole;
  const industry = preInterviewForm.elements.industry;
  if (role && !role.value) role.value = pack.role;
  if (industry && !industry.value) industry.value = pack.industry;
}

function renderPackSummary() {
  if (!testPackSummary || !testPackSelect) return;
  const pack = getSelectedPack();
  testPackSummary.innerHTML = `<strong>${pack.role}</strong><br>${pack.summary}<br><small>Competencies: ${pack.competencies.join(", ")}</small>`;
  syncPreInterviewFields(pack);
}

function populateReadinessPacks() {
  if (!testPackSelect) return;
  testPackSelect.innerHTML = readinessPacks.map((pack) => `<option value="${pack.id}">${getPackLabel(pack)}</option>`).join("");
  renderPackSummary();
}

function renderReadinessQuestions(pack) {
  if (!testForm || !testTitle || !testProgress) return;
  testTitle.textContent = getPackLabel(pack);
  testProgress.textContent = `Question 1-${pack.questions.length} of ${pack.questions.length}`;
  testForm.innerHTML = pack.questions.map((question, questionIndex) => {
    const options = question.options.map((option, optionIndex) => `
      <label>
        <input type="radio" name="question-${questionIndex}" value="${optionIndex}" required>
        <span>${option}</span>
      </label>
    `).join("");

    return `
      <fieldset class="tests-question">
        <div class="tests-question-meta">
          <span>${question.type}</span>
          <span>${question.competency}</span>
        </div>
        <h4>${questionIndex + 1}. ${question.text}</h4>
        <div class="tests-options">${options}</div>
      </fieldset>
    `;
  }).join("");
}

function startReadinessCheck() {
  activeReadinessPack = getSelectedPack();
  renderReadinessQuestions(activeReadinessPack);
  if (testsDiagnostic) testsDiagnostic.hidden = false;
  if (testsReport) testsReport.hidden = true;
  testsDiagnostic?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getReadinessLabel(score) {
  if (score >= 80) return "Interview-ready";
  if (score >= 60) return "Nearly ready";
  if (score >= 40) return "Developing readiness";
  return "Needs focused preparation";
}

function getReadinessCopy(score, pack) {
  if (score >= 80) return `Strong result for ${pack.role}. You appear ready for a realistic interview conversation, with final polishing recommended.`;
  if (score >= 60) return `Good foundation for ${pack.role}. Focus on the missed competency areas before the real assessment.`;
  if (score >= 40) return `You have useful starting points, but this role pack shows preparation gaps that should be worked on before interview day.`;
  return `This result suggests you should complete guided practice before taking a formal assessment or interview for this role.`;
}

function scoreReadinessCheck() {
  if (!testForm || !activeReadinessPack) return;
  const answers = activeReadinessPack.questions.map((_, index) => testForm.querySelector(`input[name="question-${index}"]:checked`));

  if (answers.some((answer) => !answer)) {
    showToast("Please answer every readiness question before generating your report.");
    return;
  }

  const correctItems = [];
  const missedItems = [];
  answers.forEach((answer, index) => {
    const question = activeReadinessPack.questions[index];
    const isCorrect = Number(answer.value) === question.answer;
    (isCorrect ? correctItems : missedItems).push(question);
  });

  const score = Math.round((correctItems.length / activeReadinessPack.questions.length) * 100);
  if (testsScoreValue) testsScoreValue.textContent = `${score}%`;
  if (testsScoreLabel) testsScoreLabel.textContent = getReadinessLabel(score);
  if (testsScoreCopy) testsScoreCopy.textContent = getReadinessCopy(score, activeReadinessPack);

  if (testsFeedbackList) {
    const feedbackItems = missedItems.length ? missedItems : correctItems.slice(0, 3);
    testsFeedbackList.innerHTML = feedbackItems.map((question) => {
      const prefix = missedItems.length ? `Improve ${question.competency}` : `Strength: ${question.competency}`;
      return `<li><strong>${prefix}.</strong> ${question.feedback}</li>`;
    }).join("");
  }

  if (testsReport) testsReport.hidden = false;
  syncPreInterviewFields(activeReadinessPack);
  testsReport?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetReadinessCheck() {
  if (testsDiagnostic) testsDiagnostic.hidden = true;
  if (testsReport) testsReport.hidden = true;
  document.querySelector("#readiness-check")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formToPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[\s().-]/g, "");
}

function isValidPhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhone(phone));
}

async function sendPreInterviewRequest(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = formToPayload(form);
  payload.email = String(payload.email || "").trim().toLowerCase();
  payload.phone = normalizePhone(payload.phone);
  payload.selectedPack = activeReadinessPack ? getPackLabel(activeReadinessPack) : "";

  if (!isValidEmail(payload.email)) {
    form.elements.email.setCustomValidity("Enter a valid email address.");
    form.elements.email.reportValidity();
    form.elements.email.setCustomValidity("");
    return;
  }

  if (!isValidPhone(payload.phone)) {
    form.elements.phone.setCustomValidity("Use international format, for example +441234567890.");
    form.elements.phone.reportValidity();
    form.elements.phone.setCustomValidity("");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pre-interview-request", payload })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "We could not send your pre-interview request yet.");
    form.reset();
    syncPreInterviewFields(activeReadinessPack);
    showToast("Pre-interview request sent. Our team will contact you with the next step.");
  } catch (error) {
    showToast(error.message || "We could not send your pre-interview request yet.");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

testPackSelect?.addEventListener("change", renderPackSummary);
startTestButton?.addEventListener("click", startReadinessCheck);
scoreTestButton?.addEventListener("click", scoreReadinessCheck);
resetTestButton?.addEventListener("click", resetReadinessCheck);
retakeTestButton?.addEventListener("click", startReadinessCheck);
preInterviewForm?.addEventListener("submit", sendPreInterviewRequest);

populateReadinessPacks();
