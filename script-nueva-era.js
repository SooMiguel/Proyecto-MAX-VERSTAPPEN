// --- FORZAR SCROLL AL INICIO AL RECARGAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- 1. INICIALIZAR LENIS (SCROLL SUAVE OPTIMIZADO) ---
const lenis = new Lenis({
    duration: 1.5, // 👈 Subimos el tiempo para hacerlo más cremoso y suave
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
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

    // --- 5.5 ANIMACIONES DE RED BULL FORD POWERTRAINS ---
    const puSection = document.querySelector('.pu-section');
    if (puSection) {
        // Entra el texto desde la izquierda
        gsap.fromTo(".pu-header *",
            { x: -50, opacity: 0 },
            {
                scrollTrigger: { trigger: ".pu-section", start: "top 80%", toggleActions: "play none none none" },
                x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out"
            }
        );

        // Entra la foto del auto desde la derecha
        gsap.fromTo(".pu-car-showcase",
            { x: 100, opacity: 0 },
            {
                scrollTrigger: { trigger: ".pu-section", start: "top 80%", toggleActions: "play none none none" },
                x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3
            }
        );

        // Tarjetas entran desde abajo en cascada
        gsap.fromTo(".pu-card",
            { y: 60, opacity: 0 },
            {
                scrollTrigger: { trigger: ".pu-grid", start: "top 85%", toggleActions: "play none none none" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out"
            }
        );

        // --- LÓGICA DEL CARRUSEL 3D ---
        const slides = document.querySelectorAll('.tech-slide');
        const progressFill = document.querySelector('.progress-fill');
        let currentSlide = 0;

        function rotateCarousel() {
            // Avanzamos al siguiente slide
            currentSlide = (currentSlide + 1) % slides.length;

            slides.forEach((slide, index) => {
                // Limpiamos todas las clases
                slide.className = 'tech-slide';

                // Asignamos el nuevo estado matemático
                if (index === currentSlide) {
                    slide.classList.add('active'); // Centro
                } else if (index === (currentSlide + 1) % slides.length) {
                    slide.classList.add('next'); // Derecha
                } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                    slide.classList.add('prev'); // Izquierda
                } else {
                    slide.classList.add('hidden'); // Atrás
                }
            });

            // Reiniciamos la animación de la barra roja
            progressFill.style.animation = 'none';
            void progressFill.offsetWidth; // Forzamos reflow del navegador
            progressFill.style.animation = 'fillProgress 3.5s linear infinite';
        }

        // El carrusel rotará cada 3.5 segundos
        setInterval(rotateCarousel, 3500);
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
            scrollTrigger: {
                trigger: ".mv-footer",
                start: "top 95%", // Se activa en cuanto asoma el footer
                toggleActions: "play none none none" // Garantiza que no se vuelvan a ocultar
            }
        });

        // Usamos fromTo para obligarlos a llegar a opacity: 1
        tlFooter.fromTo(".footer-slogan", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
            .fromTo(".f-link", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.6")
            .fromTo(".social-pill", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.4")
            .fromTo(".footer-car-background", { y: "15%", opacity: 0 }, { y: "0%", opacity: 1, duration: 2, ease: "power3.out" }, "-=1.5");
    }

    // --- 8. BOTÓN VOLVER ARRIBA ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        // Mostrar/Ocultar dependiendo de cuánto bajes
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Subida suave usando Lenis
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, {
                duration: 1.5,
                ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    }

// --- ANIMACIÓN DEL CIERRE CINEMATOGRÁFICO ---
    const codaSection = document.querySelector('.ne-coda-section');
    if (codaSection) {
        // 1. Efecto Parallax súper suave en la imagen de fondo
        gsap.to(".coda-bg-img", {
            yPercent: 20, // La imagen se mueve hacia abajo mientras tú scrolleas hacia arriba
            ease: "none",
            scrollTrigger: {
                trigger: ".ne-coda-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true // Animación atada a la velocidad de la rueda del ratón
            }
        });

        // 2. Elementos de texto entrando en cascada
        gsap.fromTo(".coda-content > *", 
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".ne-coda-section",
                    start: "top 75%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15, // Entra la etiqueta, luego el título, luego el texto, luego el botón
                ease: "power3.out"
            }
        );
    }
});