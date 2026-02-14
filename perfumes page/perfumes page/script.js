
// Hamburger Toggle
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // Form Validation
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            let inputs = form.querySelectorAll("input[required]");
            for (let input of inputs) {
                if (input.value.trim() === "") {
                    alert(input.name + " is required");
                    e.preventDefault();
                    return;
                }
            }

            const email = form.querySelector("input[type='email']");
            if (email && !/\S+@\S+\.\S+/.test(email.value)) {
                alert("Enter a valid email address");
                e.preventDefault();
                return;
            }

            const password = form.querySelector("input[type='password']");
            if (password && password.value.length < 6) {
                alert("Password must be at least 6 characters");
                e.preventDefault();
                return;
            }
        });
    }
});
