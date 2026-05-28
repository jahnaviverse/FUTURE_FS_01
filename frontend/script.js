/* ========== Theme Toggle ========== */
document.addEventListener("DOMContentLoaded", () => {

  const html = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  let isLight = false;

  function updateThemeIcons() {
    if (isLight) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isLight = !isLight;
      html.classList.toggle('light', isLight);
      updateThemeIcons();
    });
  }
  updateThemeIcons();

  /* ========== Navbar Scroll ========== */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ========== Mobile Menu ========== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.getElementById('menuClose');
  let menuOpenState = false;

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuOpenState = !menuOpenState;
      mobileNav.classList.toggle('open', menuOpenState);
      if (menuOpen) menuOpen.style.display = menuOpenState ? 'none' : 'block';
      if (menuClose) menuClose.style.display = menuOpenState ? 'block' : 'none';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpenState = false;
        mobileNav.classList.remove('open');
        if (menuOpen) menuOpen.style.display = 'block';
        if (menuClose) menuClose.style.display = 'none';
      });
    });
  }

  /* ========== Year ========== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========== Contact Form with EmailJS ========== */
  
  // Initialize EmailJS with your public key
  // YOUR PUBLIC KEY - Replace this with your actual public key from EmailJS
  const EMAILJS_PUBLIC_KEY = "2apjy3_qFTV8xN557";
  
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("EmailJS initialized with public key");
  } else {
    console.error("EmailJS not loaded");
  }

  const messageForm = document.getElementById('messageForm');
  const sendBtn = document.getElementById('sendBtn');
  const formNote = document.getElementById('formNote');

  function showNote(text, type) {
    if (formNote) {
      formNote.textContent = text;
      formNote.className = 'form-note ' + type;
      setTimeout(() => {
        if (formNote && formNote.textContent === text) {
          formNote.textContent = '';
          formNote.className = 'form-note';
        }
      }, 5000);
    }
  }

  if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = messageForm.querySelector('[name="name"]').value.trim();
      const email = messageForm.querySelector('[name="email"]').value.trim();
      const message = messageForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showNote('⚠️ Please fill in all fields.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showNote('⚠️ Please enter a valid email address.', 'error');
        return;
      }

      const originalButtonText = sendBtn.innerHTML;
      sendBtn.disabled = true;
      sendBtn.innerHTML = '⏳ Sending...';

      try {
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS not loaded');
        }

        // Your EmailJS credentials
        const serviceId = 'service_9u75utg';
        const templateId = 'template_d86uz0a';
        
        console.log('Sending email with params:', { name, email, message });
        
        // Send email - the public key is already initialized above
        const response = await emailjs.send(
          serviceId,
          templateId,
          {
            name: name,
            email: email,
            message: message
          }
        );

        console.log('Success:', response);
        showNote('✅ Message sent successfully! I will get back to you soon.', 'success');
        messageForm.reset();
        
      } catch (error) {
        console.error('Error Details:', error);
        
        let errorMsg = '❌ Failed to send message. ';
        
        if (error.status === 404) {
          errorMsg += 'Service or Template not found. Please check your EmailJS IDs.';
        } else if (error.status === 401) {
          errorMsg += 'Authentication failed. Please check your Public Key.';
        } else if (error.text) {
          errorMsg += error.text;
        } else {
          errorMsg += error.message || 'Unknown error';
        }
        
        showNote(errorMsg, 'error');
        
        // Only show mail client option as last resort
        const useMailto = confirm('Email service failed. Would you like to open your email client?');
        if (useMailto) {
          const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
          const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
          window.open(`mailto:jahnavinaidu.369@gmail.com?subject=${subject}&body=${body}`, '_blank');
        }
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalButtonText;
      }
    });
  }
});