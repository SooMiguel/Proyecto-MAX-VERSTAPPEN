document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. ANIMACIÓN DE ENTRADA ---
    const tl = gsap.timeline();

    tl.to(".logo", { duration: 1.2, opacity: 1, scale: 1, ease: "power2.out" })
        .to(".logo", { duration: 0.8, opacity: 0, scale: 0.9, ease: "power2.in", delay: 0.8 })
        .to("#preloader", { duration: 1.2, y: "-100%", ease: "power4.inOut" })
        .to([".base-img", ".helmet-img"], { duration: 1.5, y: 0, opacity: 1, ease: "power3.out", stagger: 0 }, "-=0.8")
        .to(".site-header", { duration: 1, y: 0, opacity: 1, ease: "power3.out" }, "-=1.2")
        .to(".next-race-box", { duration: 1, opacity: 1, ease: "power3.out" }, "-=1");

    // --- 2. LÓGICA DE SCROLL (EL EFECTO TARJETA Y FIRMA SINCRONIZADA) ---
    const sigPath = document.querySelector('.sig-path');

    if (sigPath) {
        const sigLength = sigPath.getTotalLength();

        gsap.set(sigPath, {
            strokeDasharray: sigLength,
            strokeDashoffset: sigLength,
            fill: "transparent",
            stroke: "#ffffff",
            strokeWidth: 12
        });

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-pin-wrapper",
                start: "top top",
                // 🪄 Aumentamos el final a 2500 para que el scroll sea más largo y la firma más lenta
                end: "+=1500",
                scrub: 2, // 🪄 Subimos el scrub a 2 para que el movimiento sea más suave y menos brusco
                pin: true,
            }
        });

        // 🪄 EL ARREGLO DE LA CAJA (fromTo garantiza que la caja vuelva a verse al subir)
        scrollTl.fromTo(".next-race-box", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5 }, 0);

        // 🪄 LA SINCRONIZACIÓN PERFECTA: Estos 3 ocurren exactamente a la vez (duran 4 segs)

        // 1. 🪄 CAMBIO DE TAMAÑO: La tarjeta se encoje mucho más (scale 0.45) para revelar más fondo.
        scrollTl.to(".foreground-card", { scale: 0.45, borderRadius: "20px", duration: 8 }, 0);

        // 2. La tarjeta se oscurece (Efecto dimmer opaco que pediste)
        scrollTl.to(".card-dimmer", { opacity: 0.85, duration: 8 }, 0);

// 3. 🪄 FIRMA MUCHO MÁS LENTA: 
        // Aumentamos la duración a 8 y usamos un ease más suave
        scrollTl.to(sigPath, { 
            strokeDashoffset: 0, 
            duration: 8, 
            ease: "none" // "none" hace que se dibuje exacto a la velocidad de tu dedo en el scroll
        }, 0);
        
        // 4. El relleno ocurre al final del dibujo largo
        scrollTl.to(sigPath, { fill: "#ffffff", duration: 1 }, 8); 
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

    // --- 4. MATEMÁTICA DEL BLOB ADAPTADO AL NUEVO SCALE ---
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

        autoTl.set(blobData, { scale: 0, x: -200, y: wh * 0.15 })
            .to(blobData, { scale: 1, duration: 0.6, ease: "power2.out" }, 0)
            .to(blobData, { x: ww + 200, y: wh * 0.30, duration: dur, ease: "sine.inOut" }, 0)
            .to(blobData, { x: -200, y: wh * 0.60, duration: dur, ease: "sine.inOut" })
            .to(blobData, { x: ww + 200, y: wh * 0.90, duration: dur, ease: "sine.in" })
            .to(blobData, { scale: 0, duration: 0.6, ease: "power2.in" }, "-=0.6")
            .to({}, { duration: 0.5 })
            .to(blobData, { scale: 1, duration: 0.6, ease: "power2.out" }, "+=0")
            .to(blobData, { x: -200, y: wh * 0.60, duration: dur, ease: "sine.inOut" }, "<")
            .to(blobData, { x: ww + 200, y: wh * 0.30, duration: dur, ease: "sine.inOut" })
            .to(blobData, { x: -200, y: wh * 0.15, duration: dur, ease: "sine.in" })
            .to(blobData, { scale: 0, duration: 0.6, ease: "power2.in" }, "-=0.6")
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
            gsap.to(blobData, { scale: 1, duration: 0.5 });
        }
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (fullscreenMenu.classList.contains('active') && col1 && col2) {
            const mouseYPos = (e.clientY / window.innerHeight) - 0.5;
            const moveAmount = 300;
            gsap.to(col1, { y: mouseYPos * -moveAmount, duration: 1.5, ease: "power2.out" });
            gsap.to(col2, { y: mouseYPos * moveAmount, duration: 1.5, ease: "power2.out" });
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
        // Obtenemos el scale actual de la tarjeta para adaptar el blob local
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
        const maskPoints = createBlobPoints(currentX - imgContainer.offsetLeft, currentY - imgContainer.offsetTop, vx / currentScale, vy / currentScale, blobData.scale);
        blobPath.setAttribute("d", getSmoothPath(maskPoints));

        requestAnimationFrame(animate);
    }

    animate();
});