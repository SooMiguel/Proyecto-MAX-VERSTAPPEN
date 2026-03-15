/* ============================================================
   TRANSICIÓN RED BULL (HÍBRIDO: GSAP IN / CSS OUT)
=============================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const transitionBox = document.getElementById('rbTransition');
    const isIndex = document.getElementById('preloader') !== null;

    if (!transitionBox) return;

    // --- 1. ANIMACIÓN DE ENTRADA (Manejada por GSAP) ---
    if (!isIndex) {
        gsap.to(['.rb-navy', '.rb-red', '.rb-yellow'], {
            yPercent: 100, 
            duration: 0.7, 
            stagger: 0.1, 
            ease: "power3.inOut",
            delay: 0.1, 
            onComplete: () => {
                gsap.set(transitionBox, { visibility: 'hidden' }); 
                gsap.set('.rb-layer', { clearProps: "all" }); 
            }
        });
    }

    // --- 2. ANIMACIÓN DE SALIDA (Acelerada por CSS) ---
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            
            if(!target || target.startsWith('#') || target === window.location.pathname || link.hasAttribute('target')) return;

            e.preventDefault(); 
            
            // Asegurarnos de encender el contenedor (quitando el display: none del Index)
            transitionBox.style.display = 'block';
            
            // 👇 EXCEPCIÓN: ¿Viajamos al Index? 👇
            if (target.includes('index.html') || target === '/' || target === window.location.origin + '/') {
                gsap.set('.rb-layer', { display: 'none' }); // Apagamos colores
                gsap.set(transitionBox, { visibility: 'visible', backgroundColor: '#0c0c0c', opacity: 0 });
                gsap.to(transitionBox, { opacity: 1, duration: 0.2, onComplete: () => window.location.href = target });
                return;
            }

            // 👇 VIAJE A NUEVA ERA U OTRA PÁGINA 👇
            // Un micro-retraso imperceptible para que el navegador procese el "display: block" antes de animar
            requestAnimationFrame(() => {
                transitionBox.classList.add('is-active');
            });
            
            setTimeout(() => {
                window.location.href = target;
            }, 700);
        });
    });
});