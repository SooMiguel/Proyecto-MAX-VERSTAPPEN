document.addEventListener("DOMContentLoaded", () => {
    // --- 1. ANIMACIÓN DE ENTRADA CON GSAP ---
    const tl = gsap.timeline();

    tl.to(".logo", { duration: 1.2, opacity: 1, scale: 1, ease: "power2.out" })
      .to(".logo", { duration: 0.8, opacity: 0, scale: 0.9, ease: "power2.in", delay: 0.8 })
      .to("#preloader", { duration: 1.2, y: "-100%", ease: "power4.inOut" })
      .to([".base-img", ".helmet-img"], { duration: 1.5, y: 0, opacity: 1, ease: "power3.out", stagger: 0 }, "-=0.8")
      .to(".site-header", { duration: 1, y: 0, opacity: 1, ease: "power3.out" }, "-=1.2")
      // 👇 Animamos la entrada del cuadro de la carrera
      .to(".next-race-box", { duration: 1, x: 0, opacity: 1, ease: "power3.out" }, "-=1");

    // --- 2. LÓGICA DEL MENÚ Y PARALLAX ---
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

    // --- 3. LÓGICA DEL BLOB INTERACTIVO Y ZIGZAG AUTÓNOMO ---
    const blobPath = document.getElementById("blobPath");
    const blobVisual = document.getElementById("blobPathVisual");
    const helmetImg = document.querySelector('.helmet-img');

    // Estado inicial: El ratón no está activo, empieza la animación automática
    let mouseActive = false; 
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Variables físicas que la mancha seguirá
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let lastX = currentX;
    let lastY = currentY;
    let currentAngle = 0;

    // 🪄 Objeto fantasma que GSAP animará
    let blobData = { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2, 
        scale: 1 
    };

    let autoTl = gsap.timeline({ paused: true, repeat: -1 });

    function buildAutoTimeline() {
        autoTl.clear();
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const dur = 0.7; 

        // 1. VIAJE DE IDA 
        autoTl.set(blobData, { scale: 0, x: -200, y: wh * 0.15 })
              .to(blobData, { scale: 1, duration: 0.6, ease: "power2.out" }, 0)
              .to(blobData, { x: ww + 200, y: wh * 0.30, duration: dur, ease: "sine.inOut" }, 0)
              .to(blobData, { x: -200, y: wh * 0.60, duration: dur, ease: "sine.inOut" })
              .to(blobData, { x: ww + 200, y: wh * 0.90, duration: dur, ease: "sine.in" })
              .to(blobData, { scale: 0, duration: 0.6, ease: "power2.in" }, "-=0.6")
              .to({}, { duration: 0.5 })
              // 2. VIAJE DE REGRESO 
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

    // --- EVENTOS DEL RATÓN ---
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

    // --- MATEMÁTICAS DE LA MANCHA ---
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
        if (mouseActive) {
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;
        } else {
            currentX += (blobData.x - currentX) * 0.2;
            currentY += (blobData.y - currentY) * 0.2;
        }

        let vx = currentX - lastX;
        let vy = currentY - lastY;
        lastX = currentX;
        lastY = currentY;

        const rect = helmetImg.getBoundingClientRect();

        const visualPoints = createBlobPoints(currentX, currentY, vx, vy, blobData.scale);
        blobVisual.setAttribute("d", getSmoothPath(visualPoints));
        
        const maskPoints = createBlobPoints(currentX - rect.left, currentY - rect.top, vx, vy, blobData.scale);
        blobPath.setAttribute("d", getSmoothPath(maskPoints));

        requestAnimationFrame(animate);
    }

    animate();
});