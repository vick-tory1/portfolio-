"use strict";

const PROJECT_TYPES = new Set(["small-business", "major-ecommerce", "education-platform", "fintech-website", "business-website", "ecommerce", "web-application", "redesign", "wordpress", "graphic-design", "brand-identity", "print-packaging", "digital-campaign", "video-motion", "other"]);
const WHATSAPP = "2349057920012";
const EMAIL = "adamsekpe2@gmail.com";
const PROJECT_LABELS = { "small-business": "small-business website", "major-ecommerce": "major e-commerce business website and online store", "education-platform": "educational website or learning platform", "fintech-website": "fintech website or web application", "business-website": "business or organisation website", ecommerce: "e-commerce website", "web-application": "custom web application", redesign: "website redesign", wordpress: "WordPress website", "graphic-design": "graphic or multimedia design project", "brand-identity": "logo or brand identity project", "print-packaging": "print or product packaging design", "digital-campaign": "social media or digital campaign design", "video-motion": "video editing or motion design project", other: "portfolio project" };

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

function validateLead(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "Enter valid project details." };
  if (typeof body.name === "string" && body.name.trim().length > 100) return { error: "Keep the name to 100 characters or fewer." };
  if (typeof body.email === "string" && body.email.trim().length > 254) return { error: "Keep the email address to 254 characters or fewer." };
  if (typeof body.business === "string" && body.business.trim().length > 120) return { error: "Keep the business name to 120 characters or fewer." };
  if (typeof body.description === "string" && body.description.trim().length > 1000) return { error: "Keep the project description to 1,000 characters or fewer." };
  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 40);
  const business = cleanText(body.business, 120);
  const description = cleanText(body.description, 1000);
  const projectType = PROJECT_TYPES.has(body.projectType) ? body.projectType : "other";
  const preferredContact = body.preferredContact === "email" ? "email" : "whatsapp";
  if (body.email && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return { error: "Enter a valid email address or leave it blank." };
  if (body.phone !== undefined && body.phone !== null && typeof body.phone !== "string") return { error: "Enter the WhatsApp number as text or leave it blank." };
  if (typeof body.phone === "string" && body.phone.trim().length > 40) return { error: "Keep the WhatsApp number to 40 characters or fewer." };
  if (phone && !/^\+?[\d\s().-]{7,24}$/.test(phone)) return { error: "Enter a valid WhatsApp number or leave it blank." };
  if (body.name && !name) return { error: "The name contains unsupported characters." };
  if (body.business && !business) return { error: "The business name is too long." };
  if (body.description && !description) return { error: "Keep the project description under 1,000 characters." };

  const projectLabel = PROJECT_LABELS[projectType];
  const lines = [`Hi Adams, I found your portfolio and would like to discuss a ${projectLabel}.`];
  if (name) lines.push(`Name: ${name}`);
  if (business) lines.push(`Business/organisation: ${business}`);
  if (description) lines.push(`Project details: ${description}`);
  if (email) lines.push(`Email: ${email}`);
  if (phone) lines.push(`WhatsApp: ${phone}`);
  const draft = lines.join("\n");
  return { draft, projectType, projectLabel, name, email, phone, business, description, preferredContact, source: "portfolio-support-chat" };
}

function contactUrl(preferredContact, draft) {
  const message = encodeURIComponent(draft);
  return preferredContact === "email"
    ? `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio project enquiry")}&body=${message}`
    : `https://wa.me/${WHATSAPP}?text=${message}`;
}

async function draftWithGemini(lead) {
  const fallback = lead.draft;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { draft: fallback, method: "template" };

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Write a brief, natural first-person message from a prospective client to Adams Ekpe. Use only the supplied project details. Do not add requirements, deadlines, budgets, claims, or facts the visitor did not provide. If a detail is blank, omit it. Do not include advice or commentary, only the message draft. Keep it under 900 characters and make it suitable to review before sending by WhatsApp or email." }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify({ projectType: lead.projectType, projectLabel: lead.projectLabel, name: lead.name, email: lead.email, whatsapp: lead.phone, business: lead.business, projectDescription: lead.description }) }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.25 },
      }),
    });
    if (!response.ok) return { draft: fallback, method: "template" };
    const result = await response.json();
    const generated = result.candidates?.[0]?.content?.parts?.map(part => typeof part.text === "string" ? part.text : "").join("").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, 1200);
    return generated ? { draft: generated, method: "ai" } : { draft: fallback, method: "template" };
  } catch {
    return { draft: fallback, method: "template" };
  }
}

function respond(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(body);
}

async function handler(req, res) {
  if (req.method !== "POST") return respond(res, 405, { error: "Use POST to prepare project contact details." });
  const origin = req.headers.origin;
  if (origin && req.headers.host && new URL(origin).host !== req.headers.host) return respond(res, 403, { error: "This request is not allowed." });
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const lead = validateLead(body);
  if (lead.error) return respond(res, 400, lead);
  const generated = await draftWithGemini(lead);
  return respond(res, 200, { url: contactUrl(lead.preferredContact, generated.draft), preferredContact: lead.preferredContact, draftMethod: generated.method });
}

function safeParse(value) {
  try { return JSON.parse(value); } catch { return null; }
}

module.exports = handler;
module.exports.validateLead = validateLead;
module.exports.draftWithGemini = draftWithGemini;
module.exports.contactUrl = contactUrl;