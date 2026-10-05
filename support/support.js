"use strict";

(() => {
  const storageKey = "adams-portfolio-support-v1";
  const transcript = document.getElementById("chatTranscript");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatMessage");
  const chatError = document.getElementById("chatError");
  const sendButton = document.getElementById("sendMessage");
  const clearButton = document.getElementById("clearChat");
  const projectType = document.getElementById("projectType");
  const leadForm = document.getElementById("leadForm");
  const handoffLink = document.getElementById("handoffLink");
  const handoffCaption = document.getElementById("handoffCaption");
  const handoffError = document.getElementById("handoffError");
  const handoffButton = document.getElementById("prepareHandoff");
  const messages = loadMessages();
  let sending = false;

  function loadMessages() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
      if (Array.isArray(stored)) return stored.filter(message => message && ["user", "assistant"].includes(message.role) && typeof message.content === "string").slice(-20);
    } catch {}
    return [];
  }

  function saveMessages() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-20))); } catch {}
  }

  function createLocalHandoff(details) {
    const projectLabels = {
      "small-business": "small-business website",
      "major-ecommerce": "major e-commerce business website and online store",
      "education-platform": "educational website or learning platform",
      "fintech-website": "fintech website or web application",
      "business-website": "business or organisation website",
      ecommerce: "e-commerce website",
      "web-application": "custom web application",
      redesign: "website redesign",
      wordpress: "WordPress website",
      "graphic-design": "graphic or multimedia design project",
      "brand-identity": "logo or brand identity project",
      "print-packaging": "print or product packaging design",
      "digital-campaign": "social media or digital campaign design",
      "video-motion": "video editing or motion design project",
      other: "portfolio project",
    };
    const clean = value => typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim() : "";
    const email = clean(details.email);
    const phone = clean(details.phone);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address or leave it blank." };
    if (phone && !/^\+?[\d\s().-]{7,24}$/.test(phone)) return { error: "Enter a valid WhatsApp number or leave it blank." };

    const projectLabel = projectLabels[details.projectType] || projectLabels.other;
    const lines = [`Hi Adams, I found your portfolio and would like to discuss a ${projectLabel}.`];
    const name = clean(details.name);
    const business = clean(details.business);
    const description = clean(details.description);
    if (name) lines.push(`Name: ${name}`);
    if (business) lines.push(`Business/organisation: ${business}`);
    if (description) lines.push(`Project details: ${description}`);
    if (email) lines.push(`Email: ${email}`);
    if (phone) lines.push(`WhatsApp: ${phone}`);
    const message = encodeURIComponent(lines.join("\n"));
    const preferredContact = details.preferredContact === "email" ? "email" : "whatsapp";
    const url = preferredContact === "email"
      ? `mailto:adamsekpe2@gmail.com?subject=${encodeURIComponent("Portfolio project enquiry")}&body=${message}`
      : `https://wa.me/2349057920012?text=${message}`;
    return { url, preferredContact, draftMethod: "local-template" };
  }

  function renderMessage(message) {
    const row = document.createElement("article");
    row.className = `chat-message ${message.role}`;
    const speaker = document.createElement("span");
    speaker.className = "speaker";
    speaker.textContent = message.role === "assistant" ? "Adams's AI portfolio assistant" : "You";
    const content = document.createElement("p");
    content.textContent = message.content;
    row.append(speaker, content);
    transcript.append(row);
  }

  function renderAll() {
    transcript.replaceChildren();
    if (!messages.length) {
      messages.push({ role: "assistant", content: "Hi, I'm Adams's AI portfolio assistant. I can answer questions about the web development and graphic/multimedia design work shown in this portfolio, or help you outline a project to discuss with Adams. What are you looking to build or design?" });
      saveMessages();
    }
    messages.forEach(renderMessage);
    transcript.scrollTop = transcript.scrollHeight;
  }

  function addMessage(role, content) {
    const message = { role, content };
    messages.push(message);
    while (messages.length > 20) messages.shift();
    renderMessage(message);
    transcript.scrollTop = transcript.scrollHeight;
    saveMessages();
  }

  function setBusy(value) {
    sending = value;
    sendButton.disabled = value;
    chatInput.disabled = value;
    sendButton.textContent = value ? "Thinking…" : "Send message";
    const previous = transcript.querySelector(".typing-message");
    if (previous) previous.remove();
    if (value) {
      const typing = document.createElement("article");
      typing.className = "chat-message assistant typing-message";
      const speaker = document.createElement("span");
      speaker.className = "speaker";
      speaker.textContent = "Adams's AI portfolio assistant";
      const text = document.createElement("p");
      text.textContent = "Thinking";
      const dots = document.createElement("span");
      dots.className = "typing-dots";
      dots.setAttribute("aria-label", "assistant is typing");
      for (let index = 0; index < 3; index += 1) dots.append(document.createElement("i"));
      text.append(dots);
      typing.append(speaker, text);
      transcript.append(typing);
      transcript.scrollTop = transcript.scrollHeight;
    }
  }

  async function sendMessage(text) {
    const message = text.trim();
    if (!message || sending) return;
    chatError.hidden = true;
    addMessage("user", message);
    chatInput.value = "";
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: messages.slice(-12).slice(0, -1), projectType: projectType.value }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "The project assistant is unavailable right now.");
      if (!data || typeof data.reply !== "string") throw new Error("The project assistant returned an invalid response. You can contact Adams directly below.");
      addMessage("assistant", data.reply);
    } catch (error) {
      chatError.textContent = `${error.message || "The project assistant is unavailable."} You can still contact Adams directly below.`;
      chatError.hidden = false;
      if (messages.at(-1)?.role === "user") {
        messages.pop();
        saveMessages();
      }
      chatInput.value = message;
      chatInput.focus();
    } finally {
      setBusy(false);
    }
  }

  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    void sendMessage(chatInput.value);
  });

  chatInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });

  document.querySelectorAll("[data-question]").forEach(button => {
    button.addEventListener("click", () => {
      chatInput.value = button.dataset.question;
      chatInput.focus();
    });
  });

  clearButton.addEventListener("click", () => {
    messages.length = 0;
    try { sessionStorage.removeItem(storageKey); } catch {}
    chatError.hidden = true;
    renderAll();
    chatInput.focus();
  });

  leadForm.addEventListener("submit", async event => {
    event.preventDefault();
    handoffError.hidden = true;
    handoffButton.disabled = true;
    handoffButton.textContent = "Drafting message…";
    const form = new FormData(leadForm);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      business: form.get("business"),
      description: form.get("description"),
      projectType: projectType.value,
      preferredContact: form.get("preferredContact"),
    };
    const localDraft = createLocalHandoff(payload);
    if (localDraft.error) {
      handoffError.textContent = localDraft.error;
      handoffError.hidden = false;
      handoffButton.disabled = false;
      handoffButton.textContent = "Message";
      return;
    }
    let emailWindow = null;
    if (payload.preferredContact === "email") {
      emailWindow = window.open("about:blank", "_blank");
      if (emailWindow) {
        emailWindow.opener = null;
        emailWindow.document.title = "Preparing your email draft";
        emailWindow.document.body.textContent = "Preparing your project email draft…";
      }
    }
    try {
      let data = null;
      const localPreview = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname);
      let useLocalDraft = localPreview;
      if (!localPreview) {
        try {
          const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          data = await response.json().catch(() => null);
          if (response.status === 400) throw new Error(data?.error || "Check the email and WhatsApp details, then try again.");
          if (!response.ok) useLocalDraft = true;
        } catch (error) {
          if (error.message && !/Failed to fetch|NetworkError|fetch/i.test(error.message)) throw error;
          useLocalDraft = true;
        }
      }

      if (useLocalDraft || !data || typeof data.url !== "string") {
        data = localDraft;
      }

      handoffLink.href = data.url;
      handoffLink.textContent = data.preferredContact === "email" ? "Open email draft" : "Chat with Adams on WhatsApp";
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = " ↗";
      handoffLink.append(arrow);
      handoffLink.target = "_blank";
      if (data.preferredContact === "email") {
        handoffCaption.hidden = true;
        if (emailWindow) {
          emailWindow.location.href = data.url;
          handoffError.hidden = true;
        } else {
          handoffError.textContent = "Your browser blocked the email window. Click Open email draft to continue.";
          handoffError.hidden = false;
        }
      } else {
        handoffCaption.textContent = "WhatsApp draft ready. Review the message before sending.";
        handoffCaption.hidden = false;
        handoffError.hidden = true;
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
      handoffLink.focus();
    } catch (error) {
      if (emailWindow && !emailWindow.closed) emailWindow.close();
      handoffError.textContent = error.message || "The project message could not be drafted. Check the email and WhatsApp fields, then try again.";
      handoffError.hidden = false;
    } finally {
      handoffButton.disabled = false;
      handoffButton.textContent = "Message";
    }
  });

  renderAll();
})();