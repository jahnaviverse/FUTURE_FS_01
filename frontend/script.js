// =========================
// Theme Toggle
// =========================
const themeBtn = document.getElementById("themeToggle");

const setTheme = (t) => {
  document.documentElement.classList.toggle("light", t === "light");

  if (themeBtn) {
    themeBtn.textContent = t === "light" ? "☀️" : "🌙";
  }

  localStorage.setItem("theme", t);
};

setTheme(localStorage.getItem("theme") || "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    setTheme(
      document.documentElement.classList.contains("light")
        ? "dark"
        : "light"
    );
  });
}

// =========================
// Navbar Scroll
// =========================
const nav = document.getElementById("nav");

const onScroll = () => {
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 16);
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// =========================
// Mobile Menu
// =========================
const menuBtn = document.getElementById("menuToggle");
const links = document.getElementById("navLinks");

if (menuBtn && links) {
  menuBtn.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
    });
  });
}

// =========================
// Footer Year
// =========================
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =========================
// EmailJS Init
// =========================
emailjs.init("2apjy3_qFTV8xN557");

// =========================
// Contact Form
// =========================
const form = document.getElementById("messageForm");
const note = document.getElementById("formNote");

if (form && note) {
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  function showNote(text, type) {
    note.hidden = false;
    note.textContent = text;

    if (type === "success") {
      note.style.color = "#7CFFB2";
    } else if (type === "error") {
      note.style.color = "#FF8B8B";
    } else {
      note.style.color = "#ffffff";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      showNote("Please fill in all fields.", "error");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailOk) {
      showNote("Please enter a valid email address.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showNote("Sending...", "info");

    try {

      await emailjs.send(
        "service_9u75utg",
        "template_d86uz0a",
        {
          name: name,
          email: email,
          message: message,
        }
      );

      showNote("Message sent successfully!", "success");

      form.reset();

    } catch (err) {
      console.error(err);

      showNote("Failed to send message.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}