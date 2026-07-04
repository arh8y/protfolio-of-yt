document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Loading Screen Logic
    // ----------------------------------------------------------------------
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    let loadProgress = 0;

    const simulateLoading = setInterval(() => {
        loadProgress += Math.floor(Math.random() * 10) + 5;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(simulateLoading);
            
            // Fade out loader
            gsap.to(loader, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    initScrollAnimations(); // Init scroll animations after load
                }
            });
        }
        progressBar.style.width = `${loadProgress}%`;
        progressText.innerText = `${loadProgress}%`;
    }, 150);

    // ----------------------------------------------------------------------
    // 2. Custom Cursor & Magnetic Buttons
    // ----------------------------------------------------------------------
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    // Only enable custom cursor if not on touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the dot
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follow for the ring
        gsap.ticker.add(() => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        });

        // Magnetic effect and hover states
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorFollower.classList.add('hovering');
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.3)'
                });
                cursor.classList.remove('hovering');
                cursorFollower.classList.remove('hovering');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. Theme Switcher
    // ----------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlElement.setAttribute('data-theme', 'light');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });

    // ----------------------------------------------------------------------
    // 4. Typing Effect (Hero Subtitle)
    // ----------------------------------------------------------------------
    const texts = [
        "Civil Engineering Student",
        "Creative Designer",
        "Tech Enthusiast",
        "Web Developer"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-text');

    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing slightly after load
    setTimeout(typeEffect, 1500);

    // ----------------------------------------------------------------------
    // 5. Navbar Scroll Effect & Back to Top
    // ----------------------------------------------------------------------
    const navbar = document.querySelector('.glass-nav');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ----------------------------------------------------------------------
    // 6. Number Counters (Intersection Observer)
    // ----------------------------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasCounted = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) counterObserver.observe(statsSection);


    // ----------------------------------------------------------------------
    // 7. Projects Filter
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'flex';
                    // Trigger tiny animation
                    gsap.fromTo(item, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.4});
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 8. Set Current Year in Footer
    // ----------------------------------------------------------------------
    document.getElementById('year').textContent = new Date().getFullYear();

    // ----------------------------------------------------------------------
    // 9. GSAP Scroll Animations
    // ----------------------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    function initScrollAnimations() {
        // Reveal Up
        gsap.utils.toArray('.reveal-up').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 50, opacity: 0 },
                { 
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none' // Only play once
                    }
                }
            );
        });

        // Reveal Scale
        gsap.utils.toArray('.reveal-scale').forEach(elem => {
            gsap.fromTo(elem, 
                { scale: 0.8, opacity: 0 },
                { 
                    scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Reveal Left
        gsap.utils.toArray('.reveal-left').forEach(elem => {
            gsap.fromTo(elem, 
                { x: -50, opacity: 0 },
                { 
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Reveal Right
        gsap.utils.toArray('.reveal-right').forEach(elem => {
            gsap.fromTo(elem, 
                { x: 50, opacity: 0 },
                { 
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
        
        // Progress bar fills in skills section
        gsap.utils.toArray('.progress-fill').forEach(elem => {
            const targetWidth = elem.getAttribute('data-width');
            gsap.to(elem, {
                width: targetWidth,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 90%'
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 10. AJAX Form Submission
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"] span');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    btn.innerText = 'Sent Successfully!';
                    contactForm.reset();
                    setTimeout(() => { btn.innerText = originalText; }, 3000);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            btn.innerText = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            btn.innerText = 'Oops! Error.';
                        }
                        setTimeout(() => { btn.innerText = originalText; }, 3000);
                    })
                }
            })
            .catch(error => {
                btn.innerText = 'Oops! Network Error.';
                setTimeout(() => { btn.innerText = originalText; }, 3000);
            });
        });
    }
});
