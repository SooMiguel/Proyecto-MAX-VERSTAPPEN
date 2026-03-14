// --- FORZAR SCROLL AL INICIO AL RECARGAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- 1. INICIALIZAR LENIS (SMOOTH SCROLL GLOBAL) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. ENTRADA DEL HEADER ---
    gsap.to(".site-header", { 
        duration: 1, 
        y: 0, 
        opacity: 1, 
        ease: "power3.out" 
    });

    // --- 3. ANIMACIONES DEL HERO (NUEVA ERA) ---
    const tlHero = gsap.timeline();
    tlHero.from(".ep-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
          .from(".ep-title", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
          .from(".ep-desc", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from(".ep-video-box", { x: 50, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=1");

    // --- 4. ANIMACIONES DE LA TABLA DE TELEMETRÍA ---
    gsap.from(".ep-section-header *", {
        scrollTrigger: { trigger: ".ep-telemetry-section", start: "top 80%", toggleActions: "play none none reverse" },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out"
    });

    gsap.from(".ep-table-container", {
        scrollTrigger: { trigger: ".ep-table-container", start: "top 85%", toggleActions: "play none none reverse" },
        y: 50, opacity: 0, duration: 1, ease: "power3.out"
    });

    gsap.from(".f1-telemetry-table tbody tr", {
        scrollTrigger: { trigger: ".ep-table-container", start: "top 75%", toggleActions: "play none none reverse" },
        x: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out"
    });

    // --- 5. ANIMACIONES DE LA SECCIÓN DE CASCOS (ACORDEÓN) ---
    const helmetSection = document.querySelector('.ne-helmet-section');
    if (helmetSection) {
        gsap.from(".ne-helmet-text *", {
            scrollTrigger: { trigger: ".ne-helmet-section", start: "top 80%", toggleActions: "play none none reverse" },
            x: -50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
        });

        gsap.from(".accordion-item", {
            scrollTrigger: { trigger: ".ne-helmet-accordion", start: "top 85%", toggleActions: "play none none reverse" },
            y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
        });
    }

    // --- 6. LÓGICA COMPLETA DEL MENÚ (RESTAURADA) ---
    const menuBtn = document.querySelector('.menu-btn');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const col1 = document.querySelector('.col-1');
    const col2 = document.querySelector('.col-2');
    const menuItems = document.querySelectorAll('.menu-right [data-img]');
    const allMenuImages = document.querySelectorAll('.img-column img');
    const defaultImg = document.getElementById('img-2');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        fullscreenMenu.classList.toggle('active');
        if (fullscreenMenu.classList.contains('active')) {
            allMenuImages.forEach(img => img.classList.remove('color-active'));
            if (defaultImg) defaultImg.classList.add('color-active');
        }
    });

    // Efecto de movimiento de columnas con el mouse (Paralaje)
    document.addEventListener("mousemove", (e) => {
        if (fullscreenMenu.classList.contains('active') && col1 && col2) {
            const mouseYPos = (e.clientY / window.innerHeight) - 0.5;
            const moveAmount = 150; 
            gsap.to(col1, { y: mouseYPos * -moveAmount, duration: 1.5, ease: "power2.out" });
            gsap.to(col2, { y: mouseYPos * moveAmount, duration: 1.5, ease: "power2.out" });
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            allMenuImages.forEach(img => img.classList.remove('color-active'));
            const targetId = item.getAttribute('data-img');
            const targetImg = document.getElementById(targetId);
            if (targetImg) targetImg.classList.add('color-active');
        });
        item.addEventListener('mouseleave', () => {
            allMenuImages.forEach(img => img.classList.remove('color-active'));
            if (defaultImg) defaultImg.classList.add('color-active');
        });
    });

    // --- 7. ANIMACIONES DEL FOOTER ---
    const footerElem = document.querySelector('.mv-footer');
    if (footerElem) {
        const tlFooter = gsap.timeline({
            scrollTrigger: { trigger: ".mv-footer", start: "top 90%", toggleActions: "play none none reverse" }
        });

        tlFooter.from(".footer-slogan", { y: 50, opacity: 0, duration: 1, ease: "power3.out" })
                .from(".f-link", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.6")
                .from(".social-pill", { scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.4")
                .from(".footer-car-background", { y: "15%", opacity: 0, duration: 2, ease: "power3.out" }, "-=1.5");
    }
});