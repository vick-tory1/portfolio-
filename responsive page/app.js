function navSlide(){
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");

  burger.addEventListener("click", function(){
       nav.classList.toggle("nav-active");
       burger.classList.toggle("close");
  });
}

navSlide();


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  const nameInput = document.getElementById("yourname");
  const subjectInput = document.getElementById("subject");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("msg");

  function showError(input, message) {
    const error = input.nextElementSibling;
    error.textContent = message;
    input.classList.add("invalid");
    input.classList.remove("valid");
  }

  function showSuccess(input) {
    const error = input.nextElementSibling;
    error.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
  }

  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    // Name
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, "Please enter your full name");
      isValid = false;
    } else {
      showSuccess(nameInput);
    }

    // Subject
    if (subjectInput.value.trim().length < 3) {
      showError(subjectInput, "Subject must be at least 3 characters");
      isValid = false;
    } else {
      showSuccess(subjectInput);
    }

    // Email
    if (!isEmailValid(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    } else {
      showSuccess(emailInput);
    }

    // Message
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Message must be at least 10 characters");
      isValid = false;
    } else {
      showSuccess(messageInput);
    }

    // Final submit
    if (isValid) {
      alert("✅ Message authenticated and ready to send!");
      form.reset();
      document
        .querySelectorAll(".valid")
        .forEach(el => el.classList.remove("valid"));
    }
  });
});
