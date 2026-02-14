
// Form Validation for Register Form
function validateRegisterForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    let isValid = true;
    let errors = [];

    // Get all required inputs
    const requiredFields = form.querySelectorAll("[required]");
    
    requiredFields.forEach(field => {
      const value = field.value.trim();
      
      // Remove previous error styling
      field.style.borderColor = "";
      
      // Check if field is empty
      if (!value) {
        isValid = false;
        field.style.borderColor = "red";
        field.style.borderWidth = "2px";
        errors.push(`${field.placeholder || field.name} is required`);
      } else {
        // Validate email format
        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            field.style.borderColor = "red";
            field.style.borderWidth = "2px";
            errors.push(`Please enter a valid email address`);
          }
        }
        
        // Validate phone number
        if (field.type === "number" && field.placeholder.includes("Phone")) {
          if (value.length < 10) {
            isValid = false;
            field.style.borderColor = "red";
            field.style.borderWidth = "2px";
            errors.push(`Phone number must be at least 10 digits`);
          }
        }
      }
    });

    // If validation fails, prevent form submission
    if (!isValid) {
      e.preventDefault();
      alert("Validation Failed:\n\n" + errors.join("\n"));
    } else {
      alert("Form submitted successfully!");
    }
  });

  // Remove error styling when user starts typing
  const allInputs = form.querySelectorAll("input, textarea, select");
  allInputs.forEach(input => {
    input.addEventListener("focus", () => {
      input.style.borderColor = "";
      input.style.borderWidth = "";
    });
  });
}

// Initialize validation on page load
document.addEventListener("DOMContentLoaded", () => {
  validateRegisterForm("registerForm");
});
