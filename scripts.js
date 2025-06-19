// DOM Elements for contact form
const contactForm = document.getElementById('contactForm');
const validationModal = document.getElementById('validationModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');
const messageInput = document.getElementById('message');
const wordCount = document.getElementById('wordCount'); 

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// EmailJS Service
const SERVICE_ID = "service_8c1m9c5"; 
const TEMPLATE_ID = "template_7nu9xho";

// Update word count for message input field
messageInput.addEventListener('input', function() {
    const text = this.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = words;
    
    if (words > 255) {
        document.getElementById('messageError').style.display = 'block';
    } else {
        document.getElementById('messageError').style.display = 'none';
    }
});



// Check for saved theme or prefer-color-scheme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Slider elements
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const pagination = document.getElementById('pagination');
            
// Slider state
let currentIndex = 0;
let slideCount = slides.length;
let autoSlideInterval;

// Initialize pagination dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
    });
    pagination.appendChild(dot);
});

// Initialize slider
updateSlider();
startAutoSlide();

// Function to navigate to a specific slide
function goToSlide(index) {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = slideCount - 1;
    if (currentIndex >= slideCount) currentIndex = 0;
    updateSlider();
}

// Update slider position and active dot
function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Start auto slide functionality
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 10000);
}

 // Reset auto slide timer
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}
        
// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
        
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
                
        const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            
            // Update active link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            }
        });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 950) {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
                
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
                
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    
    // Validate inputs
    let isValid = true;
    let errorMessage = "";
                
    if (!validateName(firstName)) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
        errorMessage = "• Name must contain only letters and be 2-30 characters\n";
    }
    
    if (!validateEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
        errorMessage += "• Please enter a valid email address\n";
    }
    
    if (!validateSubject(subject)) {
        document.getElementById('subjectError').style.display = 'block';
        isValid = false;
        errorMessage += "• Subject must contain at least 5 words\n";
    }
    
    if (!validateMessage(message)) {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
        errorMessage += "• Message must not exceed 255 words";
    }
    
    if (!isValid) {
        showModal("Form Validation Error", errorMessage);
        return;
    }
                
    // If all valid, send email
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    
    // Send email via EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            name: firstName,
            email: email,
            subject: subject,
            message: message
    })
    .then(function(response) {
        showModal("Success!", "Your message has been sent successfully. I'll get back to you soon!");
            contactForm.reset();
            wordCount.textContent = "0";
        }, function(error) {
            showModal("Error", "Failed to send your message. Please try again later.");
        })
        .finally(function() {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.disabled = false;
        });
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});