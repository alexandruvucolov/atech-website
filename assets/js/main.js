// Main JavaScript file for Atech Engineering Solutions website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initFAQ();
    initContactForm();
    initBackToTop();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting
    highlightActiveNavLink();
    window.addEventListener('scroll', highlightActiveNavLink);
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Add animation classes to elements
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.reason-card').forEach((card, index) => {
        card.classList.add('slide-in-left');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.industry-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.quick-item').forEach((item, index) => {
        item.classList.add('slide-in-right');
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('consultationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(form);
        });
    }

    // Add real-time validation
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

// Handle form submission
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Validate form
    if (!validateForm(form)) {
        resetSubmitButton(submitBtn, originalText);
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Create mailto link for now
        const subject = `Consultation Request from ${data.name}`;
        const body = `Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0APhone: ${data.phone}%0D%0ACompany: ${data.company}%0D%0AMessage: ${data.message}`;
        const mailtoLink = `mailto:sales@atech-tools.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        
        // Open mailto link
        window.location.href = mailtoLink;
        
        // Show success message
        showFormMessage('Thank you for your inquiry! We will contact you within 24 hours.', 'success');
        form.reset();
        
        resetSubmitButton(submitBtn, originalText);
    }, 1500);
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(fieldName)} is required`;
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
        message: 'Message'
    };
    return labels[fieldName] || fieldName;
}

function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.fontSize = '0.875rem';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#dcfce7';
        messageDiv.style.color = '#166534';
        messageDiv.style.border = '1px solid #bbf7d0';
    } else {
        messageDiv.style.backgroundColor = '#fef2f2';
        messageDiv.style.color = '#dc2626';
        messageDiv.style.border = '1px solid #fecaca';
    }
    
    messageDiv.textContent = message;
    
    const form = document.getElementById('consultationForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function resetSubmitButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Quick actions functionality
function initQuickActions() {
    const quickItems = document.querySelectorAll('.quick-item');
    
    quickItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            
            switch(action) {
                case 'consultation':
                    scrollToSection('contact');
                    focusElement('#consultationForm input[name="name"]');
                    break;
                case 'catalog':
                    // This would typically download a catalog or open a modal
                    showNotification('Catalog download will be available soon!');
                    break;
                case 'quote':
                    scrollToSection('contact');
                    focusElement('#consultationForm textarea[name="message"]');
                    // Pre-fill message
                    document.querySelector('#consultationForm textarea[name="message"]').value = 'I would like to request a quote for: ';
                    break;
                case 'support':
                    // This would typically open a support widget or redirect
                    window.location.href = 'mailto:sales@atech-tools.com?subject=Technical Support Request';
                    break;
            }
        });
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function focusElement(selector) {
    setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
        }
    }, 1000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? '#10b981' : '#3b82f6';
    notification.style.color = 'white';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideInRight 0.3s ease';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    highlightActiveNavLink();
}, 100);

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize quick actions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initQuickActions();
});

// Service Worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful');
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Hide broken images or show placeholder
            this.style.display = 'none';
        });
    });
});

// Analytics tracking (placeholder - replace with actual analytics)
function trackEvent(eventName, properties = {}) {
    // Replace with your analytics solution (Google Analytics, etc.)
    console.log('Event tracked:', eventName, properties);
}

// Track key interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track form submissions
    document.getElementById('consultationForm')?.addEventListener('submit', function() {
        trackEvent('form_submission', { form_type: 'consultation' });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('button_click', { button_text: this.textContent.trim() });
        });
    });
    
    // Track section views
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
});