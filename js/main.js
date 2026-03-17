document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // 4. Form Submission Mock
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                btn.innerHTML = 'Mensagem Enviada <i class="ph-bold ph-check"></i>';
                btn.style.background = '#22c55e'; // success green
                btn.style.color = '#fff';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style = '';
                }, 3000);
            }, 1500);
        });
    }
    // 5. Lead Capture Modal Logic
    const leadModal = document.getElementById('leadModalOverlay');
    const unlockBtns = document.querySelectorAll('.unlock-tool');
    const closeLeadBtn = document.getElementById('closeLeadModal');
    const leadUnlockForm = document.getElementById('leadUnlockForm');
    const redirectInput = document.getElementById('toolRedirectUrl');

    function openLeadModal(url) {
        redirectInput.value = url;
        leadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLeadModalFunc() {
        leadModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    unlockBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = btn.getAttribute('data-target');
            openLeadModal(url);
        });
    });

    if (closeLeadBtn) {
        closeLeadBtn.addEventListener('click', closeLeadModalFunc);
    }

    if (leadModal) {
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) closeLeadModalFunc();
        });
    }

    // NOTA: O tratamento de 'submit' do leadUnlockForm foi movido para js/unified-quiz.js
    // para suportar a experiência de múltiplas etapas (quiz).
});
