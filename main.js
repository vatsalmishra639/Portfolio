// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = 80;
                const targetPosition = targetSection.offsetTop - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Initialize scroll animations and typing
    initScrollAnimations();
    setTimeout(initTypingAnimation, 500);

    // Initialize contact form
    initContactForm();
});

// Scroll animations
function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-fade-in');
        });
    }, observerOptions);
    document.querySelectorAll('section').forEach(section => observer.observe(section));
}

// Typing animation
function initTypingAnimation() {
    const titleElement = document.querySelector('#home h1');
    if (!titleElement) return;
    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    let index = 0;
    function typeChar() {
        if (index < originalText.length) {
            titleElement.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeChar, 100);
        }
    }
    setTimeout(typeChar, 1000);
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) return showNotification('Please fill in all fields.', 'error');
        if (!isValidEmail(email)) return showNotification('Please enter a valid email address.', 'error');

        const formData = { name, email, message, timestamp: new Date().toISOString() };
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        contactForm.reset();
        showNotification("Thank you for your message! I'll get back to you soon.", 'success');
    });
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Notification system
function showNotification(message, type='info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.classList.add('notification','fixed','top-24','right-6','z-50','max-w-sm','p-4','rounded-lg','shadow-lg','transition-all','duration-300');
    switch(type){
        case 'success': notification.classList.add('bg-green-500','text-white'); break;
        case 'error': notification.classList.add('bg-red-500','text-white'); break;
        case 'warning': notification.classList.add('bg-yellow-500','text-white'); break;
        default: notification.classList.add('bg-blue-500','text-white');
    }
    notification.innerHTML = `<div class="flex items-center"><div class="flex-1">${message}</div><button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200"><i class="fas fa-times"></i></button></div>`;
    document.body.appendChild(notification);
    setTimeout(() => { if(notification.parentElement) notification.remove(); }, 5000);
}

// Active navigation highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('text-blue-600','font-semibold');
        if(link.getAttribute('href') === `#${current}`) link.classList.add('text-blue-600','font-semibold');
    });
});
