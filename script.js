/* =========================
   START PAGE FROM TOP
========================= */
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});
//intro
window.addEventListener("load", () => {

    const intro = document.getElementById("intro");

    setTimeout(() => {
        intro.style.pointerEvents = "none";
    }, 5000);

});
/* =========================
   ABOUT SCROLL REVEAL
========================= */

const aboutSection = document.querySelector(".about");

if (aboutSection) {

    const aboutObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    // Animate IN
                    entry.target.classList.add("show");

                } else {

                    // Reset animation
                    entry.target.classList.remove("show");

                }

            });

        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    aboutObserver.observe(aboutSection);
}
/* =========================
   EDUCATION SCROLL REVEAL
========================= */

const educationCards = document.querySelectorAll(".education-card");

const educationObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });
    },
    {
        threshold: 0.2
    }
);

educationCards.forEach((card) => {
    educationObserver.observe(card);
});
/* =========================
   SKILLS & TOOLS SCROLL ANIMATION
========================= */

const skillToolCards = document.querySelectorAll(
    ".skill-card, .tool-card"
);

const skillToolObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });
    },
    {
        threshold: 0.15
    }
);

skillToolCards.forEach((card) => {
    skillToolObserver.observe(card);
});
/* =========================
   PROJECT SCROLL ANIMATION
   PLAYS EVERY TIME
========================= */

const projectCards = document.querySelectorAll(".project");

const projectObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                // Start animation
                entry.target.classList.add("show");

            } else {

                // Reset animation when leaving
                entry.target.classList.remove("show");

            }

        });

    },
    {
        threshold: 0.15
    }
);

projectCards.forEach(card => {
    projectObserver.observe(card);
});

//
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

// =========================
// CONTACT FORM
// =========================

const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const submitButton = contactForm.querySelector("button[type='submit']");

contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();


    // =========================
    // VALIDATE FIELDS
    // =========================

    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
    }


    // =========================
    // DISABLE BUTTON
    // =========================

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    successMessage.style.display = "none";


    try {

        // =========================
        // SEND TO BACKEND
        // =========================

        const response = await fetch(
            "https://my-portfolio-sssl.onrender.com/api/messages",
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


        // =========================
        // SUCCESS
        // =========================

        if (data.success) {

            // Clear form
            contactForm.reset();


            // =========================
            // SHOW SIMPLE SUCCESS
            // =========================

            successMessage.textContent =
                "✓ Thank you! Your message has been received. A confirmation email has been sent to you.";

            successMessage.style.display = "block";


            // Change button
            submitButton.textContent =
                "Message Received ✓";


        } else {

            throw new Error(
                data.message ||
                "Failed to send message."
            );

        }


    } catch (error) {

        console.error(
            "Contact form error:",
            error
        );

        alert(
            "Unable to send your message. Please try again."
        );


        // Restore button
        submitButton.textContent =
            "Send Message";

    } finally {

        // Enable button again
        submitButton.disabled = false;

    }

});