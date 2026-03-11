// --- FORZAR SCROLL AL INICIO AL RECARGAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 1. INICIALIZAR LENIS (SMOOTH SCROLL GLOBAL)
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

// --- SCROLLBAR INTELIGENTE Y BOTÓN ---
let scrollTimeout;
const htmlElement = document.documentElement;
const backToTopBtn = document.getElementById('backToTop');

htmlElement.style.setProperty('--scroll-thumb-color', 'transparent');
htmlElement.style.setProperty('--scroll-border-color', 'transparent');

lenis.on('scroll', (e) => {
    const currentScroll = e.scroll;

    if (currentScroll > 20) {
        htmlElement.style.setProperty('--scroll-thumb-color', '#4a4a4a');
        htmlElement.style.setProperty('--scroll-border-color', '#010204');
    } else {
        htmlElement.style.setProperty('--scroll-thumb-color', '#ffffff');
        htmlElement.style.setProperty('--scroll-border-color', '#010204');
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        htmlElement.style.setProperty('--scroll-thumb-color', 'transparent');
        htmlElement.style.setProperty('--scroll-border-color', 'transparent');
    }, 800);

    if (backToTopBtn) {
        if (currentScroll > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. ANIMACIÓN DE ENTRADA ---
    const tl = gsap.timeline();

    // Entra el logo de Max original en el centro
    tl.to(".logo", { duration: 1.2, opacity: 1, scale: 1, ease: "power2.out", force3D: true })
        .to(".logo", { duration: 0.8, opacity: 0, scale: 0.9, ease: "power2.in", delay: 0.8, force3D: true })
        .to("#preloader", { duration: 1.2, y: "-100%", ease: "power4.inOut", force3D: true })
        .to([".base-img", ".helmet-img"], { duration: 1.5, y: 0, opacity: 1, ease: "power3.out", stagger: 0, force3D: true }, "-=0.8")
        .to(".site-header", { duration: 1, y: 0, opacity: 1, ease: "power3.out", force3D: true }, "-=1.2")
        // 🪄 AMBOS CUADROS ENTRAN JUNTOS
        .to(".next-race-box, .team-info-box", { duration: 1, x: 0, opacity: 1, ease: "power3.out", force3D: true }, "-=1");

    // --- 2. LÓGICA DE SCROLL ---
    const sigPath = document.querySelector('.sig-path');

    if (sigPath) {
        const sigLength = sigPath.getTotalLength();

        gsap.set(sigPath, {
            strokeDasharray: sigLength,
            strokeDashoffset: sigLength,
            fill: "transparent",
            stroke: "#ffffff",
            strokeWidth: 12,
            force3D: true
        });

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-pin-wrapper",
                start: "top top",
                end: "+=900",
                scrub: 1,
                pin: true,
            }
        });

        // 🪄 AMBOS CUADROS SE DESVANECEN AL BAJAR
        scrollTl.fromTo(".next-race-box, .team-info-box",
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.5, force3D: true }, 0
        );

        scrollTl.to(".foreground-card", { scale: 0.45, borderRadius: "20px", ease: "power1.inOut", duration: 4, force3D: true }, 0)
            .to(".card-dimmer", { opacity: 0.85, duration: 4, force3D: true }, 0)
            .to(sigPath, { strokeDashoffset: 0, duration: 4, ease: "power1.inOut", force3D: true }, 0)
            .to(sigPath, { fill: "#ffffff", duration: 0.5, force3D: true }, 4);
    }

    // --- 3. LÓGICA DEL MENÚ ---
    const menuBtn = document.querySelector('.menu-btn');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const col1 = document.querySelector('.col-1');
    const col2 = document.querySelector('.col-2');
    const menuItems = document.querySelectorAll('.menu-right [data-img]');
    const allMenuImages = document.querySelectorAll('.img-column img');
    const defaultImg = document.getElementById('img-1');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        fullscreenMenu.classList.toggle('active');
        if (fullscreenMenu.classList.contains('active')) {
            allMenuImages.forEach(img => img.classList.remove('color-active'));
            if (defaultImg) defaultImg.classList.add('color-active');
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
            const targetId = item.getAttribute('data-img');
            const targetImg = document.getElementById(targetId);
            if (targetImg) targetImg.classList.remove('color-active');
            if (defaultImg) defaultImg.classList.add('color-active');
        });
    });

    // --- 4. MATEMÁTICA DEL BLOB ---
    const blobPath = document.getElementById("blobPath");
    const blobVisual = document.getElementById("blobPathVisual");
    const helmetImg = document.querySelector('.helmet-img');
    let mouseActive = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let lastX = currentX;
    let lastY = currentY;
    let currentAngle = 0;

    let blobData = { x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1 };
    let autoTl = gsap.timeline({ paused: true, repeat: -1 });

    function buildAutoTimeline() {
        autoTl.clear();
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const dur = 0.7;
        autoTl.set(blobData, { scale: 0, x: -200, y: wh * 0.15, force3D: true })
            .to(blobData, { scale: 1, duration: 0.6, ease: "power2.out", force3D: true }, 0)
            .to(blobData, { x: ww + 200, y: wh * 0.30, duration: dur, ease: "sine.inOut", force3D: true }, 0)
            .to(blobData, { x: -200, y: wh * 0.60, duration: dur, ease: "sine.inOut", force3D: true })
            .to(blobData, { x: ww + 200, y: wh * 0.90, duration: dur, ease: "sine.in", force3D: true })
            .to(blobData, { scale: 0, duration: 0.6, ease: "power2.in", force3D: true }, "-=0.6")
            .to({}, { duration: 0.5 })
            .to(blobData, { scale: 1, duration: 0.6, ease: "power2.out", force3D: true }, "+=0")
            .to(blobData, { x: -200, y: wh * 0.60, duration: dur, ease: "sine.inOut", force3D: true }, "<")
            .to(blobData, { x: ww + 200, y: wh * 0.30, duration: dur, ease: "sine.inOut", force3D: true })
            .to(blobData, { x: -200, y: wh * 0.15, duration: dur, ease: "sine.in", force3D: true })
            .to(blobData, { scale: 0, duration: 0.6, ease: "power2.in", force3D: true }, "-=0.6")
            .to({}, { duration: 0.5 });
    }
    buildAutoTimeline();

    window.addEventListener('resize', () => {
        buildAutoTimeline();
        if (!mouseActive) autoTl.play();
    });

    document.addEventListener("mousemove", (e) => {
        if (!mouseActive) {
            mouseActive = true;
            autoTl.pause();
            gsap.to(blobData, { scale: 1, duration: 0.5, force3D: true });
        }
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (fullscreenMenu.classList.contains('active') && col1 && col2) {
            const mouseYPos = (e.clientY / window.innerHeight) - 0.5;
            const moveAmount = 300;
            gsap.to(col1, { y: mouseYPos * -moveAmount, duration: 1.5, ease: "power2.out", force3D: true });
            gsap.to(col2, { y: mouseYPos * moveAmount, duration: 1.5, ease: "power2.out", force3D: true });
        }
    });

    document.addEventListener("mouseleave", () => {
        mouseActive = false;
        autoTl.restart();
    });
    autoTl.play();

    function getSmoothPath(points) {
        if (points.length < 3) return "";
        let path = "";
        const midPoints = [];
        for (let i = 0; i < points.length; i++) {
            let next = points[(i + 1) % points.length];
            midPoints.push({ x: (points[i].x + next.x) / 2, y: (points[i].y + next.y) / 2 });
        }
        path += `M ${midPoints[0].x} ${midPoints[0].y}`;
        for (let i = 0; i < points.length; i++) {
            let control = points[(i + 1) % points.length];
            let end = midPoints[(i + 1) % midPoints.length];
            path += ` Q ${control.x} ${control.y} ${end.x} ${end.y}`;
        }
        return path + " Z";
    }

    function createBlobPoints(cx, cy, currentVx, currentVy, scale) {
        const points = [];
        const numPoints = 8;
        const time = Date.now() * 0.003;
        const speed = Math.hypot(currentVx, currentVy);
        if (speed > 0.5) currentAngle = Math.atan2(currentVy, currentVx);
        const stretchX = 1 + (speed * 0.035);
        const stretchY = 1 - (speed * 0.015);
        const baseRadius = 130 * scale;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const noise = (Math.sin(time + i * 2) * 40 + Math.cos(time * 0.8 + i * 2) * 40) * scale;
            const r = baseRadius + noise;
            let px = Math.cos(angle) * (r * 0.75);
            let py = Math.sin(angle) * (r * 1.3);
            px *= stretchX;
            py *= stretchY;
            let rotX = px * Math.cos(currentAngle) - py * Math.sin(currentAngle);
            let rotY = px * Math.sin(currentAngle) + py * Math.cos(currentAngle);
            points.push({ x: cx + rotX, y: cy + rotY });
        }
        return points;
    }

    function animate() {
        const currentScale = gsap.getProperty(".foreground-card", "scale") || 1;
        const cardRect = document.querySelector('.foreground-card').getBoundingClientRect();

        let targetX = (mouseX - cardRect.left) / currentScale;
        let targetY = (mouseY - cardRect.top) / currentScale;

        if (mouseActive) {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
        } else {
            currentX += (blobData.x - currentX) * 0.2;
            currentY += (blobData.y - currentY) * 0.2;
        }

        let vx = currentX - lastX;
        let vy = currentY - lastY;
        lastX = currentX;
        lastY = currentY;

        const visualPoints = createBlobPoints(currentX, currentY, vx / currentScale, vy / currentScale, blobData.scale);
        blobVisual.setAttribute("d", getSmoothPath(visualPoints));

        const imgContainer = document.querySelector('.image-container');
        if (imgContainer) {
            const maskPoints = createBlobPoints(currentX - imgContainer.offsetLeft, currentY - imgContainer.offsetTop, vx / currentScale, vy / currentScale, blobData.scale);
            blobPath.setAttribute("d", getSmoothPath(maskPoints));
        }

        requestAnimationFrame(animate);
    }
    animate();

    // --- 5. ANIMACIÓN DE REVELADO DE FRASE ---
    const quoteLines = document.querySelectorAll(".quote-line");

    if (quoteLines.length > 0) {
        quoteLines.forEach((line, index) => {
            const cover = line.querySelector(".reveal-cover");

            gsap.set(cover, { scaleX: 1, transformOrigin: "right center", force3D: true });

            gsap.to(cover, {
                scrollTrigger: {
                    trigger: line,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                scaleX: 0,
                duration: 0.8,
                ease: "power3.inOut",
                delay: index * 0.15,
                force3D: true
            });
        });
    }

    // --- 6. SCROLL HORIZONTAL (HISTORIA DE MAX) ---
    const historySection = document.querySelector('.history-section');
    const historyTrack = document.querySelector('.history-track');

    if (historySection && historyTrack) {
        // Obtenemos cuánto espacio debe recorrer hacia la izquierda
        function getScrollAmount() {
            let trackWidth = historyTrack.scrollWidth;
            return -(trackWidth - window.innerWidth);
        }

        // 🪄 Guardamos el movimiento horizontal en una variable
        const horizontalTween = gsap.to(historyTrack, {
            x: getScrollAmount,
            ease: "none",
            force3D: true,
            scrollTrigger: {
                trigger: historySection,
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });

        // 🪄 ANIMACIÓN DE REVELADO DE LA TABLA (Mismo efecto que la frase)
        const tableCover = document.querySelector('.table-cover');

        if (tableCover) {
            // Forzamos el bloque rojo a estar 100% estirado tapando todo
            gsap.set(tableCover, { scaleX: 1, transformOrigin: "right center", force3D: true });

            // Lo animamos para que se encoja a 0
            gsap.to(tableCover, {
                scaleX: 0,
                duration: 0.8,
                ease: "power3.inOut",
                force3D: true,
                scrollTrigger: {
                    trigger: ".table-block",
                    containerAnimation: horizontalTween, // Magia pura: detecta su posición en el scroll horizontal
                    start: "left 70%", // Se activa cuando la tabla entra al 70% de la pantalla por la derecha
                    toggleActions: "play none none reverse" // Se vuelve a tapar si regresas el scroll
                }
            });
        }
    }
    // --- 7. AUTOMATIZACIÓN DE LA PRÓXIMA CARRERA (FORZADO) ---
    const f1Calendar = [
        { date: "2026-03-08", name: "GP de Australia", svg: "australia.svg", range: "6 - 8 de marzo" },
        { date: "2026-03-15", name: "GP de China", svg: "china.svg", range: "13 - 15 de marzo" },
        { date: "2026-03-29", name: "GP de Japón", svg: "japon.svg", range: "27 - 29 de marzo" },
        { date: "2026-04-12", name: "GP de Baréin", svg: "bahrein.svg", range: "10 - 12 de abril" },
        { date: "2026-04-19", name: "GP de Arabia Saudita", svg: "arabiasaudita.svg", range: "17 - 19 de abril" },
        { date: "2026-05-03", name: "GP de Miami", svg: "miami.svg", range: "1 - 3 de mayo" },
        { date: "2026-05-24", name: "GP de Canadá", svg: "canada.svg", range: "22 - 24 de mayo" },
        { date: "2026-06-07", name: "GP de Mónaco", svg: "monaco.svg", range: "5 - 7 de junio" },
        { date: "2026-06-14", name: "GP de Barcelona", svg: "barcelona.svg", range: "12 - 14 de junio" },
        { date: "2026-06-28", name: "GP de Austria", svg: "austria.svg", range: "26 - 28 de junio" },
        { date: "2026-07-05", name: "GP de Gran Bretaña", svg: "granbretaña.svg", range: "3 - 5 de julio" },
        { date: "2026-07-19", name: "GP de Bélgica", svg: "belgica.svg", range: "17 - 19 de julio" },
        { date: "2026-07-26", name: "GP de Hungría", svg: "hungria.svg", range: "24 - 26 de julio" },
        { date: "2026-08-23", name: "GP de Países Bajos", svg: "paisesbajos.svg", range: "21 - 23 de agosto" },
        { date: "2026-09-06", name: "GP de Italia", svg: "italia.svg", range: "4 - 6 de septiembre" },
        { date: "2026-09-13", name: "GP de Madrid", svg: "madrid.svg", range: "11 - 13 de septiembre" },
        { date: "2026-09-26", name: "GP de Azerbaiyán", svg: "azerbaiyan.svg", range: "24 - 26 de septiembre" },
        { date: "2026-10-11", name: "GP de Singapur", svg: "singapur.svg", range: "9 - 11 de octubre" },
        { date: "2026-10-25", name: "GP de Estados Unidos", svg: "estadosunidos.svg", range: "23 - 25 de octubre" },
        { date: "2026-11-01", name: "GP de México", svg: "mexico.svg", range: "30 de oct - 1 de nov" },
        { date: "2026-11-08", name: "GP de Brasil", svg: "brasil.svg", range: "6 - 8 de noviembre" },
        { date: "2026-11-21", name: "GP de Las Vegas", svg: "lasvegas.svg", range: "19 - 21 de noviembre" },
        { date: "2026-11-29", name: "GP de Qatar", svg: "qatar.svg", range: "27 - 29 de noviembre" },
        { date: "2026-12-06", name: "GP de Abu Dabi", svg: "abudabi.svg", range: "4 - 6 de diciembre" }
    ];

    async function updateNextRace() {
        console.log("🏁 1. Iniciando script de próxima carrera...");

        const titleEl = document.getElementById('dynamic-race-name');
        const datesEl = document.getElementById('dynamic-race-dates'); // 🪄 Capturamos el nuevo elemento de fechas
        const container = document.getElementById('circuit-container');

        if (!titleEl || !container) {
            console.error("❌ 2. ERROR: No encuentro los contenedores en el HTML.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 👇 1. COMENTAMOS LA BÚSQUEDA AUTOMÁTICA POR FECHA 👇
        const nextRace = f1Calendar.find(race => {
            const raceDate = new Date(race.date + "T00:00:00");
            return raceDate >= today;
        });

        // 👇 2. AGREGAMOS ESTA LÍNEA PARA FORZAR EL CIRCUITO (MODIFICA EL NOMBRE AQUÍ) 👇
        //const nextRace = f1Calendar.find(race => race.svg === "italia.svg");

        if (nextRace) {
            console.log(`✅ 3. Carrera detectada: ${nextRace.name}`);

            // 🪄 Actualizamos ambos textos en el HTML
            titleEl.innerText = nextRace.name;
            if (datesEl) datesEl.innerText = nextRace.range;

            try {
                console.log(`🔍 4. Buscando archivo: assets/circuits/${nextRace.svg}`);
                const response = await fetch(`assets/circuits/${nextRace.svg}`);

                if (response.ok) {
                    const svgText = await response.text();
                    container.innerHTML = svgText;
                    console.log("🏎️ 5. ¡Circuito inyectado con éxito!");
                } else {
                    console.error(`⚠️ El archivo ${nextRace.svg} no se encontró. Revisa la carpeta.`);
                    titleEl.innerText = `${nextRace.name} (Falta archivo)`;
                }
            } catch (error) {
                console.error("❌ Error de Fetch.", error);
            }
        } else {
            titleEl.innerText = "Temporada Finalizada";
            if (datesEl) datesEl.innerText = ""; // Limpiamos la fecha si la temporada acabó
        }
    }

    // 🔥 Ejecutamos la función directamente
    updateNextRace();

    // --- 8. ANIMACIÓN CONTADOR DE ESTADÍSTICAS YApproach but not touchApproach but not touch DRAMÁTICO SIMÉTRICO ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const maxBgImgRight = document.getElementById('max-bg-img-right');
    const maxBgImgLeft = document.getElementById('max-bg-img-left');

    if (statNumbers.length > 0 || maxBgImgRight || maxBgImgLeft) {
        // 🪄 LÓGICA DEApproach but not touch Approach but not touch Approach but not touch DRAMÁTICO SIMÉTRICO DESDE AMBOS LADOS
        if (maxBgImgRight && maxBgImgLeft) {
            // Imagen del lado derecho (simétrica), revelado desde la DERECHA
            gsap.fromTo(maxBgImgRight, {
                opacity: 0,
                x: 150 // Approach but not touch Approach but not touch Approach but not touch dramatical reveal Approach but not touch dramático
            }, {
                scrollTrigger: {
                    trigger: ".stats-section",
                    start: "top 75%", // Se activa cuando la sección llega al 75% de la pantalla
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                x: 0, // Approach but not touch dramatical reveal Approach but not touch dramático
                duration: 1.5,
                ease: "power3.out",
                force3D: true
            });

            // Imagen del lado izquierdo (original), revelado desde la IZQUIERDA
            gsap.fromTo(maxBgImgLeft, {
                opacity: 0,
                x: -150 // Approach but not touch dramatical reveal Approach but not touch dramático
            }, {
                scrollTrigger: {
                    trigger: ".stats-section",
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                x: 0, // Approach but not touch dramatical reveal Approach but not touch dramático
                duration: 1.5,
                ease: "power3.out",
                force3D: true
            });
        }

        // Animación de entrada de las 4 tarjetas (Copiados igual que antes)
        gsap.from(".stat-card", {
            scrollTrigger: {
                trigger: ".stats-section",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            force3D: true
        });

        // Animación de los números contando (Copiados igual que antes)
        statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-target'));

            gsap.to(stat, {
                scrollTrigger: {
                    trigger: ".stats-section",
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                innerHTML: targetValue,
                duration: 2.5,
                ease: "power3.out",
                snap: { innerHTML: 1 },
                force3D: true
            });
        });
    }

    // --- 9. ANIMACIÓN SECCIÓN DE MERCH Y HEADER INVERTIDO ---
    const merchSectionElem = document.querySelector('.merch-section');

    if (merchSectionElem) {

        // Animaciones del texto y collage
        const tlMerch = gsap.timeline({
            scrollTrigger: {
                trigger: ".merch-section",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        tlMerch.from(".merch-text-box", { x: -100, opacity: 0, duration: 1, ease: "power3.out" })
            .to(".merch-main", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
            .fromTo(".merch-sub-1", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, "-=0.6")
            .fromTo(".merch-sub-2", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, "-=0.6")
            .fromTo(".merch-floating-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");

        // --- 10. GSAP CAMBIO DE COLOR DEL HEADER (.site-header) ---
        const headerElement = document.querySelector('.site-header');
        const merchSectionElem = document.querySelector('.merch-section');

        if (headerElement && merchSectionElem) {
            ScrollTrigger.create({
                trigger: ".merch-section",
                start: "top 80px", // Se activa cuando la sección llega casi arriba
                end: "bottom 80px", // Se desactiva al salir
                toggleClass: { targets: ".site-header", className: "header-dark-mode" }
            });
        }
    }
}); // <-- Fin del document.addEventListener