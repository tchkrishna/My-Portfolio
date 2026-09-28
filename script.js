
window.addEventListener("load", () => {

    const intro = document.getElementById("intro");

    setTimeout(() => {
        intro.style.pointerEvents = "none";
    }, 5000);

});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

function checkOrientation() {
  if (window.innerWidth > window.innerHeight) {
    console.log("Landscape / 16:9 style view");

    document.body.classList.add("landscape");
    document.body.classList.remove("portrait");
  } else {
    console.log("Portrait / 9:16 style view");

    document.body.classList.add("portrait");
    document.body.classList.remove("landscape");
  }
}

// Run when page loads
checkOrientation();

// Run whenever the phone is rotated
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);


// Contact Form
const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const submitButton = contactForm.querySelector("button[type='submit']");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate fields
    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
    }

    // Disable button while sending
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    successMessage.style.display = "none";

    try {
        const response = await fetch(
            "https://krishna-portfolio-2-m0w1.onrender.com/api/messages",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            // Clear form
            contactForm.reset();

            // Show success message
            successMessage.textContent =
                "✓ Thank you! Your message is received. I will reply as soon as possible.";

            successMessage.style.display = "block";

            // Change button
            submitButton.textContent = "Message Received ✓";

        } else {
            throw new Error(data.message || "Failed to send message.");
        }

    } catch (error) {

        console.error("Contact form error:", error);

        alert("Unable to send your message. Please try again.");

        // Restore button
        submitButton.textContent = "Send Message";

    } finally {

        // Enable button again
        submitButton.disabled = false;
    }
});

