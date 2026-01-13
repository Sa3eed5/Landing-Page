// OrderTech JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen when page is loaded
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 500);
            }, 1000);
        }
    });
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth > 768) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let charIndex = 0;
        const typingSpeed = 50;
        
        const typeWriter = () => {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced form validation and submission handler
    const form = document.querySelector('.form');
    if (form) {
        // Real-time validation
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Validate individual field
        function validateField(field) {
            const errorSpan = field.parentElement.querySelector('.error-message');
            let isValid = true;
            let errorMessage = '';
            
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (field.type === 'email' && field.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            } else if (field.type === 'tel' && field.value) {
                const phonePattern = /^[+]?[0-9]{10,15}$/;
                if (!phonePattern.test(field.value.replace(/[\s-]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            } else if (field.hasAttribute('minlength')) {
                const minLength = parseInt(field.getAttribute('minlength'));
                if (field.value.length < minLength) {
                    isValid = false;
                    errorMessage = `Minimum ${minLength} characters required`;
                }
            }
            
            if (!isValid) {
                field.classList.add('error');
                if (errorSpan) errorSpan.textContent = errorMessage;
            } else {
                field.classList.remove('error');
                if (errorSpan) errorSpan.textContent = '';
            }
            
            return isValid;
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let allValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    allValid = false;
                }
            });
            
            if (!allValid) {
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type=\"submit\"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Simulate API call (in production, this would send to a server)
            setTimeout(() => {
                // Display success message
                const successDiv = form.querySelector('.form-success');
                if (successDiv) {
                    successDiv.innerHTML = `
                        <div style="background: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem;">
                            <strong>\u2713 Success!</strong><br>
                            Thank you for your interest! Our team will contact you within 24 hours.
                        </div>
                    `;
                }
                
                // Reset form
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                
                // Scroll to success message
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        });
    }

    // FAQ accordion functionality (enhanced)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Initially hide answers
        answer.style.display = 'none';
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        
        question.style.cursor = 'pointer';
        question.style.position = 'relative';
        question.style.paddingRight = '2rem';
        
        // Add toggle icon
        const icon = document.createElement('span');
        icon.className = 'faq-icon';
        icon.textContent = '+';
        icon.style.cssText = `
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        `;
        question.appendChild(icon);
        
        // Add keyboard support
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        answer.setAttribute('id', `faq-answer-${index}`);
        
        const toggleFAQ = () => {
            const isOpen = answer.style.display === 'block';
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    otherAnswer.style.display = 'none';
                    otherAnswer.style.maxHeight = '0';
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    if (otherIcon) {
                        otherIcon.textContent = '+';
                        otherIcon.style.transform = 'translateY(-50%)';
                    }
                }
            });
            
            // Toggle current FAQ
            if (isOpen) {
                answer.style.display = 'none';
                answer.style.maxHeight = '0';
                question.setAttribute('aria-expanded', 'false');
                icon.textContent = '+';
                icon.style.transform = 'translateY(-50%)';
            } else {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
                icon.textContent = '-';
                icon.style.transform = 'translateY(-50%) rotate(180deg)';
            }
        };
        
        question.addEventListener('click', toggleFAQ);
        question.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ();
            }
        });
    });

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    // Animated number counter
    const animateNumber = (element, targetText, duration = 2000) => {
        const hasPercent = targetText.includes('%');
        const hasPlus = targetText.includes('+');
        const hasSlash = targetText.includes('/');
        const numericValue = parseFloat(targetText.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(numericValue)) {
            let current = 0;
            const increment = numericValue / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    element.textContent = targetText;
                    clearInterval(timer);
                } else {
                    let display = current.toFixed(1);
                    if (hasPercent) display += '%';
                    if (hasPlus) display += '+';
                    element.textContent = display;
                }
            }, 16);
        }
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animate-in', 'animated');
                
                // Animate numbers in stat cards
                const statNumber = entry.target.querySelector('.stat-number');
                const statBig = entry.target.querySelector('.stat-big');
                
                if (statNumber && statNumber.textContent) {
                    const originalText = statNumber.textContent;
                    animateNumber(statNumber, originalText);
                }
                
                if (statBig && statBig.textContent) {
                    const originalText = statBig.textContent;
                    animateNumber(statBig, originalText);
                }
            }
        });
    }, observerOptions);

    // Observe stat cards
    document.querySelectorAll('.stat-card, .stat-item').forEach(stat => {
        observer.observe(stat);
    });

    // Mobile menu toggle (if needed)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav-menu');
        const navContainer = document.querySelector('.nav-container');
        
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.style.cssText = `
                display: block;
                font-size: 1.5rem;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
            `;
            
            menuToggle.addEventListener('click', () => {
                if (nav) {
                    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
                    nav.style.flexDirection = 'column';
                    nav.style.position = 'absolute';
                    nav.style.top = '100%';
                    nav.style.left = '0';
                    nav.style.right = '0';
                    nav.style.background = 'white';
                    nav.style.padding = '1rem';
                    nav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }
            });
            
            navContainer.appendChild(menuToggle);
        }
    };

    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // Comprehensive Theme Toggle with System Preference Detection
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to system preference
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    
    // Set theme
    const setTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    };
    
    // Update theme toggle icon
    const updateThemeIcon = (theme) => {
        if (themeToggle) {
            const svg = themeToggle.querySelector('svg');
            if (theme === 'dark') {
                // Sun icon for dark mode (click to go light)
                svg.innerHTML = `
                    <circle cx="12" cy="12" r="4"></circle>
                    <line x1="12" y1="2" x2="12" y2="4"></line>
                    <line x1="12" y1="20" x2="12" y2="22"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="2" y1="12" x2="4" y2="12"></line>
                    <line x1="20" y1="12" x2="22" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                `;
            } else {
                // Moon icon for light mode (click to go dark)
                svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            }
        }
    };
    
    // Initialize theme
    setTheme(getPreferredTheme());
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Scroll to top functionality
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 500 && !document.querySelector('.scroll-to-top')) {
                const scrollBtn = document.createElement('button');
                scrollBtn.className = 'scroll-to-top';
                scrollBtn.innerHTML = '↑';
                scrollBtn.style.cssText = `
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                    z-index: 999;
                    transition: all 0.3s;
                `;
                
                scrollBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                
                scrollBtn.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                });
                
                scrollBtn.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
                
                document.body.appendChild(scrollBtn);
            } else if (window.scrollY <= 500) {
                const existingBtn = document.querySelector('.scroll-to-top');
                if (existingBtn) {
                    existingBtn.remove();
                }
            }
        }, 100);
    });

    // Add animation classes for cards on scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    // Apply fade-in animation to cards
    document.querySelectorAll('.problem-card, .solution-card, .feature-card, .use-case-card, .benefit-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        cardObserver.observe(card);
        
        // Add 3D tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Parallax scrolling effect for animations
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.hero-animation, .section-animation');
                
                parallaxElements.forEach(element => {
                    const speed = 0.3;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Mouse following effect for primary CTAs
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Progress bar animation for steps
    const steps = document.querySelectorAll('.step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('step-animated')) {
                setTimeout(() => {
                    entry.target.classList.add('step-active', 'step-animated');
                }, index * 200);
            }
        });
    }, { threshold: 0.5 });
    
    steps.forEach(step => stepObserver.observe(step));
    
    // Integration slider enhanced interaction
    const setupIntegrationSlider = () => {
        const sliders = document.querySelectorAll('.logo-slider');
        
        sliders.forEach(slider => {
            const track = slider.querySelector('.logo-track');
            if (!track) return;
            
            // Speed up on hover
            slider.addEventListener('mouseenter', () => {
                track.style.animationDuration = '20s';
            });
            
            slider.addEventListener('mouseleave', () => {
                track.style.animationDuration = '40s';
            });
            
            // Add mouse parallax effect
            slider.addEventListener('mousemove', (e) => {
                const rect = slider.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const percentX = mouseX / rect.width;
                
                // Slightly adjust speed based on mouse position
                const speedMultiplier = 0.8 + (percentX * 0.4);
                const baseSpeed = 40;
                track.style.animationDuration = (baseSpeed / speedMultiplier) + 's';
            });
        });
    };
    
    setTimeout(setupIntegrationSlider, 500);
    
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.5 });
    
    sectionTitles.forEach(title => titleObserver.observe(title));
    
    // Pulse animation for CTA buttons
    setTimeout(() => {
        document.querySelectorAll('.cta .btn-primary, .hero-actions .btn-primary').forEach(btn => {
            btn.classList.add('pulse-animation');
        });
    }, 2000);
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const nav = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.mobile-menu-btn');
            if (nav && nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
    
    // Track button clicks for analytics (placeholder)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            const btnHref = this.getAttribute('href');
            console.log('Button clicked:', { text: btnText, href: btnHref });
            // In production, send to analytics service
        });
    });
    
    // Performance monitoring
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log('Page load time:', (loadTime / 1000).toFixed(2) + 's');
            }, 0);
        });
    }
});
