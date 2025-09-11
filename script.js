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

    // Google Calendar Integration
    loadGoogleCalendarEvents();
});

// Google Calendar API Integration
async function loadGoogleCalendarEvents() {
    // Only run on events page
    if (!document.querySelector('.events-list')) return;
    
    const CALENDAR_ID = 'c_30fd9569f750ccfb1d8fcacd354e814213f016626f94a1848b8dee1a07e06513@group.calendar.google.com';
    const API_KEY = 'AIzaSyDGfj3imYMjLOqwluYgOCjTbCUfyGYKk9M';
    
    const now = new Date().toISOString();
    const maxTime = new Date();
    maxTime.setMonth(maxTime.getMonth() + 3); // Get events for next 3 months
    
    console.log(`Searching for events from ${now} to ${maxTime.toISOString()}`);
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?` +
        `key=${API_KEY}&timeMin=${now}&timeMax=${maxTime.toISOString()}&` +
        `singleEvents=true&orderBy=startTime&maxResults=20`;
    
    try {
        console.log('Fetching calendar events from:', url);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Calendar API response:', data);
        
        if (data.error) {
            console.error('Calendar API error:', data.error);
            showNoEventsMessage();
            return;
        }
        
        if (data.items && data.items.length > 0) {
            console.log(`Found ${data.items.length} events:`, data.items);
            const deduplicatedEvents = deduplicateRecurringEvents(data.items);
            console.log(`After deduplication: ${deduplicatedEvents.length} unique events`);
            renderCalendarEvents(deduplicatedEvents);
        } else {
            console.log('No events found in calendar');
            showNoEventsMessage();
        }
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        showNoEventsMessage();
    }
}

function deduplicateRecurringEvents(events) {
    console.log('Deduplicating events:', events.map(e => ({ title: e.summary, date: e.start.dateTime || e.start.date })));
    
    const uniqueEvents = new Map();
    
    // First pass: identify all recurring events
    const eventTitles = events.map(e => e.summary?.toLowerCase().trim() || 'untitled');
    const duplicateTitles = eventTitles.filter((title, index) => eventTitles.indexOf(title) !== index);
    
    events.forEach(event => {
        const eventKey = event.summary?.toLowerCase().trim() || 'untitled';
        const eventDate = new Date(event.start.dateTime || event.start.date);
        
        // No need to mark recurring events - just deduplicate
        
        // Keep only the earliest occurrence of each event
        if (!uniqueEvents.has(eventKey) || 
            eventDate < new Date(uniqueEvents.get(eventKey).start.dateTime || uniqueEvents.get(eventKey).start.date)) {
            uniqueEvents.set(eventKey, event);
        }
    });
    
    const result = Array.from(uniqueEvents.values())
        .sort((a, b) => new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date))
        .slice(0, 5);
        
    console.log('After deduplication:', result.map(e => ({ title: e.summary, date: e.start.dateTime || e.start.date })));
    return result;
}

function detectRecurrencePattern(similarEvents) {
    if (similarEvents.length < 2) return null;
    return 'Next Occurrence';
}

function renderCalendarEvents(events) {
    const eventsContainer = document.querySelector('.events-list');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = ''; // Clear existing content
    
    events.forEach(event => {
        const startTime = new Date(event.start.dateTime || event.start.date);
        const endTime = new Date(event.end.dateTime || event.end.date);
        
        const eventCard = createEventCard({
            title: event.summary,
            description: event.description || 'No description available.',
            startTime: startTime,
            endTime: endTime,
            location: event.location || 'Location TBD'
        });
        
        eventsContainer.appendChild(eventCard);
    });
}

function createEventCard(eventData) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = monthNames[eventData.startTime.getMonth()];
    const day = eventData.startTime.getDate();
    
    const timeOptions = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    };
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const startTimeStr = eventData.startTime.toLocaleTimeString('en-US', timeOptions);
    const endTimeStr = eventData.endTime.toLocaleTimeString('en-US', timeOptions);
    const dateStr = eventData.startTime.toLocaleDateString('en-US', dateOptions);
    
    // No recurrence info needed
    
    card.innerHTML = `
        <div class="event-date">
            <div class="event-month">${month}</div>
            <div class="event-day">${day}</div>
        </div>
        <div class="event-details">
            <h3 class="event-title">${eventData.title}</h3>
            <div class="event-info">
                <div class="event-time">📅 ${dateStr} • ${startTimeStr} - ${endTimeStr}</div>
                <div class="event-location">📍 ${eventData.location}</div>
                <div class="event-description">
                    <p>${eventData.description}</p>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function showNoEventsMessage() {
    const eventsContainer = document.querySelector('.events-list');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = `
        <div class="no-events-state">
            <div class="no-events-icon">📅</div>
            <h3>No Upcoming Events</h3>
            <p>We're currently planning our next set of events. Stay tuned for updates!</p>
        </div>
    `;
}