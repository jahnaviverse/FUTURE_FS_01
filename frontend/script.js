// Theme toggle
const themeBtn = document.getElementById("themeToggle");
const setTheme = (t) => {
  document.documentElement.classList.toggle("light", t === "light");
  themeBtn.textContent = t === "light" ? "☀️" : "🌙";
  localStorage.setItem("theme", t);
};
setTheme(localStorage.getItem("theme") || "dark");
themeBtn.addEventListener("click", () => {
  setTheme(document.documentElement.classList.contains("light") ? "dark" : "light");
});

// Navbar scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 16);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const menuBtn = document.getElementById("menuToggle");
const links = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Message form → POST to backend /contact =====
// Change this if your backend runs somewhere else (e.g. deployed URL)
const API_URL = "http://future-fs-01-wuwa.onrender.com/contact";

const form = document.getElementById("messageForm");
const note = document.getElementById("formNote");
const submitBtn = form.querySelector("button[type='submit']");
const originalBtnText = submitBtn.textContent;

function showNote(text, type) {
  note.hidden = false;
  note.textContent = text;
  note.style.color =
    type === "success" ? "#7CFFB2" :
    type === "error"   ? "#FF8B8B" : "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page refresh

  const data = new FormData(form);
  const name    = (data.get("name")    || "").toString().trim();
  const email   = (data.get("email")   || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  // Basic validation
  if (!name || !email || !message) {
    showNote("Please fill in all fields.", "error");
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    showNote("Please enter a valid email address.", "error");
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  showNote("Sending...", "info");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) throw new Error("Request failed");

    showNote("Message sent successfully!", "success");
    form.reset();
  } catch (err) {
    showNote("Failed to send message.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});
