const authorBio =
  "Hi, I’m Adams Celestina Ekpe, (YHWH’s Chosen) a multidisciplinary technology professional, full-stack web developer with a front-end focus, certified graphic and multimedia designer, cybersecurity practitioner, and DevOps enthusiast. I specialize in building responsive, user-centered digital experiences using modern web technologies, API integrations, and deployment workflows. Passionate about AI, emerging technologies, cybersecurity, automation, and cloud infrastructure, I bridge creativity, engineering, and innovation to build intelligent digital solutions for the future.";

const authorNamePattern =
  /(Adams Celestina Ekpe|Vicktory(?:\s+AKA\s+YHWH[’']s\s+Chosen)?(?:\s+Adams Ekpe)?|Tory Adams(?:\s+Ekpe)?|Adams Ekpe)/gi;

const footerRoots = document.querySelectorAll(
  "footer, #footer-container, .footer-bottom, .footer-signoff, .credit",
);

footerRoots.forEach((footer) => {
  const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    if (
      !walker.currentNode.parentElement?.closest(".author-bio") &&
      authorNamePattern.test(walker.currentNode.textContent || "")
    ) {
      textNodes.push(walker.currentNode);
    }
    authorNamePattern.lastIndex = 0;
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent || "";
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    authorNamePattern.lastIndex = 0;
    while ((match = authorNamePattern.exec(text)) !== null) {
      fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));

      const name = document.createElement("span");
      name.className = "author-bio";
      name.title = authorBio;
      name.tabIndex = 0;
      name.textContent = match[0];
      fragment.append(name);
      lastIndex = match.index + match[0].length;
    }

    fragment.append(document.createTextNode(text.slice(lastIndex)));
    textNode.replaceWith(fragment);
  });
});
