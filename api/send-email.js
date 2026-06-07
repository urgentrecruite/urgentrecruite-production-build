const DEFAULT_RECIPIENTS = {
  info: process.env.URGENT_RECRUITE_INFO_EMAIL || "info@urgentrecruite.com",
  intern: process.env.URGENT_RECRUITE_INTERN_EMAIL || "intern@urgentrecruite.com",
  careers: process.env.URGENT_RECRUITE_CAREERS_EMAIL || "careers@urgentrecruite.com",
  recruitment: process.env.URGENT_RECRUITE_RECRUITMENT_EMAIL || "recruitment@urgentrecruite.com"
};

const SENDERS = {
  info: process.env.URGENT_RECRUITE_INFO_SENDER || "Urgent Recruite <info@urgentrecruite.com>",
  intern: process.env.URGENT_RECRUITE_INTERN_SENDER || "Urgent Recruite Interns <intern@urgentrecruite.com>",
  careers: process.env.URGENT_RECRUITE_CAREERS_SENDER || "Urgent Recruite Careers <careers@urgentrecruite.com>",
  recruitment: process.env.URGENT_RECRUITE_RECRUITMENT_SENDER || "Urgent Recruite Recruitment <recruitment@urgentrecruite.com>"
};

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function money(value) {
  const amount = Number(value) || 0;
  return amount
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)
    : "Not provided";
}

function parseBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return {};
    }
  }
  return request.body;
}

async function sendResendEmail(apiKey, email) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(email)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "Email provider rejected the request.");
  }

  return data;
}

function buildEmails(type, payload = {}) {
  const name = clean(payload.fullName || payload.name || payload.contactName || "there");
  const company = clean(payload.companyName || payload.organization || "your organization");
  const jobTitle = clean(payload.jobTitle || payload.shortlistTitle || "your request");

  if (type === "contact-confirmation") {
    return [{
      from: SENDERS.info,
      to: clean(payload.email),
      subject: "We received your message",
      text: `Hello ${name},\n\nThank you for contacting Urgent Recruite. We have received your message and our team will respond as soon as possible.\n\nThe right people, exactly when you need them.\n\nUrgent Recruite`
    }, {
      from: SENDERS.info,
      to: DEFAULT_RECIPIENTS.info,
      subject: "New website contact request",
      text: `New contact request\n\nName: ${name}\nEmail: ${clean(payload.email)}\nPhone: ${clean(payload.phone)}\nMessage: ${clean(payload.message)}`
    }];
  }

  if (type === "cv-submission-confirmation") {
    return [{
      from: SENDERS.careers,
      to: clean(payload.email),
      subject: "Your profile has been received",
      text: `Hello ${name},\n\nThank you for submitting your CV to Urgent Recruite. Our team will review your profile and contact you if there is a suitable opportunity.\n\nUrgent Recruite Careers`
    }];
  }

  if (type === "intern-application-confirmation") {
    return [{
      from: SENDERS.intern,
      to: clean(payload.email),
      subject: "Your intern profile has been received",
      text: `Hello ${name},\n\nThank you for submitting your intern profile to Urgent Recruite. Our team will review your details for suitable intern opportunities.\n\nUrgent Recruite Interns`
    }];
  }

  if (type === "employer-request-confirmation") {
    return [{
      from: SENDERS.recruitment,
      to: clean(payload.workEmail || payload.email),
      subject: "We received your shortlist request",
      text: `Hello ${name},\n\nThank you for submitting a shortlist request for ${company}. We have received the role details for ${jobTitle} and our recruitment team will begin reviewing the request.\n\nUrgent Recruite Recruitment`
    }, {
      from: SENDERS.recruitment,
      to: DEFAULT_RECIPIENTS.recruitment,
      subject: `New shortlist request from ${company}`,
      text: `New employer request\n\nCompany: ${company}\nContact: ${name}\nEmail: ${clean(payload.workEmail || payload.email)}\nRole: ${jobTitle}\nRequest type: ${clean(payload.source || "shortlist")}`
    }];
  }

  if (type === "shortlist-link") {
    return [{
      from: SENDERS.recruitment,
      to: clean(payload.to || payload.clientEmail),
      subject: `Secure shortlist link for ${company}`,
      text: `Hello,\n\nYour secure shortlist link is ready for ${company}.\n\nShortlist: ${clean(payload.shortlistTitle)}\nLink: ${clean(payload.secureLink)}\n\nContact details remain protected inside the Urgent Recruite workflow.\n\nUrgent Recruite Recruitment`
    }];
  }

  if (type === "profile-request") {
    const selectedRefs = Array.isArray(payload.selectedProfileReferences)
      ? payload.selectedProfileReferences.map((item) => `- ${clean(item)}`).join("\n")
      : "Not provided";
    const internalEmail = {
      from: SENDERS.recruitment,
      to: DEFAULT_RECIPIENTS.recruitment,
      subject: `Client requested profiles for ${company}`,
      text: `A client requested shortlisted profiles.\n\nCompany: ${company}\nClient email: ${clean(payload.clientEmail)}\nShortlist ID: ${clean(payload.shortlistId)}\nShortlist: ${clean(payload.shortlistTitle)}\nSelected profiles: ${clean(payload.selectedCount)}\nAnnual gross pay: ${money(payload.grossPay)}\nCalculated fee: ${money(payload.calculatedFee)}\n\nSelected profile references:\n${selectedRefs}\n\nNo candidate contact details were included in this notification.`
    };
    const clientEmail = clean(payload.clientEmail)
      ? [{
        from: SENDERS.recruitment,
        to: clean(payload.clientEmail),
        subject: "Your profile request has been received",
        text: `Hello,\n\nThank you. We have received your request for the selected profiles in ${clean(payload.shortlistTitle)}. Our recruitment team will contact you shortly with the next step.\n\nUrgent Recruite Recruitment`
      }]
      : [];

    return [internalEmail, ...clientEmail];
  }

  return [];
}

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    response.status(501).json({ configured: false, error: "RESEND_API_KEY is not configured." });
    return;
  }

  const { type, payload } = parseBody(request);
  const emails = buildEmails(type, payload).filter((email) => clean(email.to));

  if (!emails.length) {
    response.status(400).json({ error: "No valid email could be built for this request." });
    return;
  }

  try {
    const results = [];
    for (const email of emails) {
      results.push(await sendResendEmail(apiKey, email));
    }

    response.status(200).json({ ok: true, sent: results.length });
  } catch (error) {
    response.status(502).json({ error: error.message || "Could not send email." });
  }
};
