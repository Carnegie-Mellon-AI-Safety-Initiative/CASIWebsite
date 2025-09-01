document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject') || 'Contact from CASI Website';
            const message = formData.get('message');
            
            // Create mailto link with form data
            const emailSubject = encodeURIComponent(`[CASI] ${subject}`);
            const emailBody = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}\n\n---\nSent from CASI website`
            );
            
            window.location.href = `mailto:casi@andrew.cmu.edu?subject=${emailSubject}&body=${emailBody}`;
            
            // Reset form and show success message
            this.reset();
            showNotification('Thank you! Your email client should open with the message ready to send.', 'success');
        });
    }

    // Floating animation for hero elements (home page only)
    if (document.querySelector('.floating-shapes')) {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.005;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.005;
        });
        
        function animateShapes() {
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach((shape, index) => {
                const multiplier = (index + 1) * 0.3;
                shape.style.transform = `translate(${mouseX * multiplier}px, ${mouseY * multiplier}px)`;
            });
            requestAnimationFrame(animateShapes);
        }
        
        animateShapes();
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.hero-content, .mission-highlights, .highlight-item, .link-card, .team-member, .benefit-card, .event-type-card'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Animate stats when they become visible
    const statNumbers = document.querySelectorAll('.stat-num, .stat-number');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });

    // Enhanced navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let scrolled = false;
    
    window.addEventListener('scroll', function() {
        const isScrolled = window.scrollY > 50;
        
        if (isScrolled !== scrolled) {
            scrolled = isScrolled;
            if (scrolled) {
                navbar.style.background = 'rgba(245, 241, 235, 0.95)';
                navbar.style.borderBottom = '1px solid rgba(221, 212, 199, 0.8)';
            } else {
                navbar.style.background = 'rgba(245, 241, 235, 0.9)';
                navbar.style.borderBottom = '1px solid var(--border-subtle)';
            }
        }
    });

    // Form validation enhancements
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '14px';
            errorDiv.style.marginTop = '4px';
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            fontFamily: 'Space Grotesk, sans-serif'
        });
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add CSS for animations and error states
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .mobile-nav.active {
            display: flex !important;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #ef4444;
        }
        
        .hero-logo:hover {
            animation: logoGlow 2s infinite alternate;
        }
        
        @keyframes logoGlow {
            from {
                box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.6);
            }
            to {
                box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.4);
            }
        }
        
        .link-card, .benefit-card, .event-type-card, .team-member {
            animation-fill-mode: both;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Make the notification function globally available
    window.showNotification = showNotification;
});