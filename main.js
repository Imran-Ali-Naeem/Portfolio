;(() => {
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener)
  }

  /**
   * Preloader
   */
  const preloader = select("#preloader")
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("loaded")
        setTimeout(() => {
          preloader.style.display = "none"
        }, 500)
      }, 1000)
    })
  }

  /**
   * Navbar links active state on scroll
   */
  const navbarlinks = select("#mainNav .nav-link", true)
  const navbarlinksActive = () => {
    const position = window.scrollY + 200
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return
      const section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active")
      } else {
        navbarlink.classList.remove("active")
      }
    })
  }
  window.addEventListener("load", navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const header = select("#mainNav")
    const offset = header.offsetHeight

    const elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  const selectHeader = select("#mainNav")
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("navbar-shrink")
      } else {
        selectHeader.classList.remove("navbar-shrink")
      }
    }
    window.addEventListener("load", headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */

const backtotop = select(".back-to-top")
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add("active")
    } else {
      backtotop.classList.remove("active")
    }
  }

  // Toggle visibility on scroll
  window.addEventListener("load", toggleBacktotop)
  onscroll(document, toggleBacktotop)

  // Smooth scroll to top on click
  backtotop.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  })
}

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()
      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  })

  /**
   * Rotating text animation
   */
  const TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate
    this.el = el
    this.loopNum = 0
    this.period = parseInt(period, 10) || 2000
    this.txt = ''
    this.tick()
    this.isDeleting = false
  }

  TxtRotate.prototype.tick = function() {
    const i = this.loopNum % this.toRotate.length
    const fullTxt = this.toRotate[i]

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1)
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1)
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>'

    let delta = 200 - Math.random() * 100

    if (this.isDeleting) { delta /= 2 }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period
      this.isDeleting = true
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false
      this.loopNum++
      delta = 500
    }

    setTimeout(() => {
      this.tick()
    }, delta)
  }

  /**
   * Dark/Light mode toggle
   */
  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark')
      const isDark = document.body.classList.contains('dark')
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
      localStorage.setItem('darkMode', isDark)
    })

    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark')
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  }

  /**
   * Project filtering
   */
  const filterButtons = document.querySelectorAll('.filter-btn')
  const projectItems = document.querySelectorAll('.project-item')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'))
      // Add active class to clicked button
      button.classList.add('active')
     
      const filterValue = button.getAttribute('data-filter')
     
      projectItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block'
        } else {
          item.style.display = 'none'
        }
      })
    })
  })

  /**
   * Contact form handling
   */
  // const contactForm = document.getElementById('contactForm');
  // console.log("contactForm", contactForm);
  // if (contactForm) {
  //   contactForm.addEventListener('submit', function(e) {
  //     e.preventDefault()
  //     // Here you would typically send the form data to a server
  //     alert('Form submitted! (This is a demo)')
  //     this.reset()
  //   })
  // }

  /**
   * Initialize rotating text
   */
  window.onload = function() {
    const elements = document.getElementsByClassName('txt-rotate')
    for (let i = 0; i < elements.length; i++) {
      const toRotate = elements[i].getAttribute('data-rotate')
      const period = elements[i].getAttribute('data-period')
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period)
      }
    }
  }

  /**
   * Initialize AOS animation
   */
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  })

  /**
   * Initialize Bootstrap tooltips
   */
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /**
   * Initialize smooth scroll for all navigation links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      })
    })
  })
})()





document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and script running");

  // Initialize modal
  const otpModalEl = document.getElementById('otpModal');
  if (!otpModalEl) {
    console.error("FATAL: OTP modal element not found!");
    return;
  }
  
  const otpModal = new bootstrap.Modal(otpModalEl, {
    backdrop: 'static',
    keyboard: false
  });

  // Get all elements
  const elements = {
    otpInput: document.getElementById('otpInput'),
    submitOtpBtn: document.getElementById('submitOtpBtn'),
    cancelOtpBtn: document.getElementById('cancelOtpBtn'),
    contactForm: document.getElementById("contactForm"),
    submitBtn: document.getElementById("submitBtn"),
    nameInput: document.getElementById("name"),
    emailInput: document.getElementById("email"),
    subjectInput: document.getElementById("subject"),
    messageInput: document.getElementById("message")
  };

  // Verify all elements exist
  for (const [key, element] of Object.entries(elements)) {
    if (!element) console.error(`Missing element: ${key}`);
  }
  if (Object.values(elements).some(el => !el)) return;

  let generatedOtp = null;
  let formData = {};

  // 1. Cancel Button Handler - Fixed version
  function handleCancel() {
    console.log("Cancel button clicked");
    otpModal.hide();
    elements.submitBtn.disabled = false;
    generatedOtp = null;
    elements.otpInput.value = "";
  }

  // Attach event to both cancel buttons (modal footer and form)
  const cancelButtons = document.querySelectorAll('#cancelOtpBtn, #otpModal .btn-secondary');
  cancelButtons.forEach(btn => {
    btn.addEventListener('click', handleCancel);
  });

  // Rest of your code remains the same...
  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async function sendOtp(userEmail) {
    try {
      if (!userEmail || !userEmail.includes('@')) {
        alert("Please enter a valid email address");
        return false;
      }

      generatedOtp = generateOtp();
      console.log("Generated OTP:", generatedOtp);
      
      await emailjs.send("service_r553eno", "template_ak7audh", {
        passcode: generatedOtp,
        email: userEmail
      });
      
      otpModal.show();
      elements.submitBtn.disabled = true;
      elements.otpInput.focus();
      return true;
      
    } catch (error) {
      console.error("OTP send failed:", error);
      alert(`Failed to send OTP: ${error.text || 'Please check your email and try again'}`);
      return false;
    }
  }

  elements.submitOtpBtn.addEventListener('click', async function() {
    const enteredOtp = elements.otpInput.value.trim();
    
    if (!enteredOtp) {
      alert("Please enter the OTP");
      return;
    }

    if (enteredOtp == generatedOtp) {
      try {
        await emailjs.send("service_r553eno", "template_2axpg6t", {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        
        alert("✓ Message sent successfully!");
        elements.contactForm.reset();
        otpModal.hide();
        elements.submitBtn.disabled = false;
        generatedOtp = null;
        
      } catch (error) {
        console.error("Message send failed:", error);
        alert("Failed to send message. Please try again.");
      }
    } else {
      alert("❌ Invalid OTP. Please check and try again.");
      elements.otpInput.value = "";
      elements.otpInput.focus();
    }
  });

  elements.contactForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    formData = {
      name: elements.nameInput.value,
      email: elements.emailInput.value,
      subject: elements.subjectInput.value,
      message: elements.messageInput.value
    };
    
    console.log("Form submitted with data:", formData);
    await sendOtp(formData.email);
  });
});
