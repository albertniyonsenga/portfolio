document.addEventListener('DOMContentLoaded', function() {
    // Form-to-email endpoint
    const FORM_TO_EMAIL_ENDPOINT = "https://www.form-to-email.com/api/s/bjI1dGb6PK6t";
    
    // DOM Elements
    const contactForm = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');
    const messageInput = document.getElementById('message');
    const wordCount = document.getElementById('wordCount'); 
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const pagination = document.getElementById('pagination');
    const navLinks = document.getElementById('navLinks');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const scrollTopBtn = document.getElementById('scrollTop');
    
    // Theme Toggle
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

    // Form validation and submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(e => {
            e.style.display = 'none';
        });
        
        // Get form values
        const name = this.querySelector('[name="name"]').value;
        const email = this.querySelector('[name="email"]').value;
        const subject = this.querySelector('[name="subject"]').value;
        const message = this.querySelector('[name="message"]').value;
        
        // Validate inputs
        let isValid = true;
        
        // Name validation
        if (!name || name.trim().length < 2 || name.trim().length > 30 || !/^[a-zA-Z\s]+$/.test(name)) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }
        
        // Subject validation
        if (!subject || subject.split(/\s+/).length < 2) {
            document.getElementById('subjectError').style.display = 'block';
            isValid = false;
        }
        
        // Message validation
        if (!message || message.trim().split(/\s+/).length > 255) {
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Create form data
            const formData = Object.fromEntries(new FormData(contactForm).entries());
            
            // Send form data to Form-to-email
            const response = await fetch(FORM_TO_EMAIL_ENDPOINT, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                showStatusMessage('Message sent successfully!', true);
                // Reset form
                contactForm.reset();
                // Reset word count
                wordCount.textContent = '0';
            } else {
                showStatusMessage('Failed to send message. Please try again.', false);
            }
        } catch (error) {
            showStatusMessage('Network error. Please check your connection.', false);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });

    // Show status message function
    function showStatusMessage(message, isSuccess) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + (isSuccess ? 'success' : 'error');
        
        // Hide after 5 seconds
        setTimeout(() => {
            statusMessage.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                statusMessage.className = 'status-message';
                statusMessage.style.animation = '';
            }, 500);
        }, 5000);
    }
});