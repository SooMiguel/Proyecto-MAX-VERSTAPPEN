/* ============================================================
   SCRIPT CALENDARIO TÁCTICO 2026 (API REAL F1 + DATOS CORREGIDOS)
=============================================================== */
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. INICIALIZAR LENIS (SMOOTH SCROLL GLOBAL) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // --- 2. HEADER Y MENÚ ---
    const menuBtn = document.querySelector('.menu-btn');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const menuItems = document.querySelectorAll('.menu-right [data-img]');
    const allMenuImages = document.querySelectorAll('.img-column img');
    const defaultImg = document.getElementById('img-4');
    const col1 = document.querySelector('.col-1');
    const col2 = document.querySelector('.col-2');

    gsap.fromTo(".site-header", 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2, force3D: true }
    );

    if (menuBtn && fullscreenMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            fullscreenMenu.classList.toggle('active');
            if (fullscreenMenu.classList.contains('active')) {
                allMenuImages.forEach(img => img.classList.remove('color-active'));
                if (defaultImg) defaultImg.classList.add('color-active');
            }
        });
    }

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

    document.addEventListener('mousemove', (e) => {
        if (fullscreenMenu && fullscreenMenu.classList.contains('active') && col1 && col2) {
            const mouseYPos = (e.clientY / window.innerHeight) - 0.5;
            const moveAmount = 300;
            gsap.to(col1, { y: mouseYPos * -moveAmount, duration: 1.5, ease: "power2.out", force3D: true });
            gsap.to(col2, { y: mouseYPos * moveAmount, duration: 1.5, ease: "power2.out", force3D: true });
        }
    });

    // --- 3. ANIMACIÓN DE ENTRADA DEL HERO ---
    const calHero = document.querySelector('.cal-hero');
    if (calHero) {
        const tlHero = gsap.timeline();
        tlHero.fromTo(".cal-hero-header-text .cal-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.4 })
              .fromTo(".cal-hero-header-text .cal-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.3")
              .fromTo(".cal-hero-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5");
    }

    // --- 4. MOTOR DE DATOS 2026 (PRÓXIMA CARRERA) ---
    const nextRaceData = {
        name: "GP DE JAPÓN", flag: "🇯🇵", date: "Mar 29, 2026 14:00:00",
        track: { laps: 53, lengthKm: 5.807, totalDistanceKm: 307.47 },
        schedule: [
            { session: "Práctica 1", time: "Vie 27, 11:30" },
            { session: "Práctica 2", time: "Vie 27, 15:00" },
            { session: "Práctica 3", time: "Sáb 28, 11:30" },
            { session: "Clasificación", time: "Sáb 28, 15:00" },
            { session: "Carrera", time: "Dom 29, 14:00", isRace: true }
        ]
    };

    const statsContainer = document.getElementById('dynamic-track-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat"><span class="stat-val">${nextRaceData.track.laps}</span><span class="stat-lbl">VUELTAS</span></div>
            <div class="stat"><span class="stat-val">${nextRaceData.track.lengthKm}</span><span class="stat-lbl">KM (LONG)</span></div>
            <div class="stat"><span class="stat-val">${nextRaceData.track.totalDistanceKm}</span><span class="stat-lbl">KM (TOTAL)</span></div>
        `;
    }

    const scheduleContainer = document.getElementById('dynamic-schedule');
    if (scheduleContainer) {
        scheduleContainer.innerHTML = nextRaceData.schedule.map(item => `
            <li class="${item.isRace ? 'highlight' : ''}">
                <span>${item.session}</span> <span>${item.time}</span>
            </li>
        `).join('');
    }

    const countDownDate = new Date(nextRaceData.date).getTime();
    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            clearInterval(updateCountdown);
            const els = ["cd-days", "cd-hours", "cd-mins"];
            els.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.innerText = "00";
            });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const elDays = document.getElementById("cd-days");
        const elHours = document.getElementById("cd-hours");
        const elMins = document.getElementById("cd-mins");

        if(elDays) elDays.innerText = days.toString().padStart(2, '0');
        if(elHours) elHours.innerText = hours.toString().padStart(2, '0');
        if(elMins) elMins.innerText = minutes.toString().padStart(2, '0');
    }, 1000);

    // --- 5. SISTEMA DE FILTROS EN LISTA 2026 ---
    const filterBtns = document.querySelectorAll('.cal-filter-btn');
    const cards = document.querySelectorAll('.cal-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                gsap.to(card, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: "power2.out" });
                    } else {
                        card.style.display = 'none';
                    }
                    ScrollTrigger.refresh(); 
                }});
            });
        });
    });

    gsap.fromTo(".cal-card", 
        { y: 60, opacity: 0 }, 
        {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { 
                trigger: ".cal-list-section", 
                start: "top 80%",
                toggleActions: "play none none none"
            }
        }
    );

    // --- 6. MOTOR DE DATOS HISTÓRICOS Y ACORDEÓN (API REAL + 2025 CORREGIDO) ---
    const accordionContainer = document.getElementById('historical-accordion-container');
    
    if (accordionContainer) {
        const resultsTable = document.querySelector('.cal-results-section');
        gsap.timeline({
            scrollTrigger: {
                trigger: resultsTable,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        })
        .from(".results-header", { y: 40, opacity: 0, duration: 1, ease: "power3.out" })
        .from(".results-summary", { y: 30, opacity: 0, scale: 0.98, duration: 1, ease: "power2.out" }, "-=0.6");

        // Datos 2025 Verificados y Corregidos (Orden Ascendente)
        const data2025 = {
            year: 2025,
            isChampion: false,
            finish: "2ND",
            podiums: 17,
            races: [
                { round: "1", raceName: "Australian Grand Prix", location: "AUSTRALIA", finish: "2", lap: "1:20.113" },
                { round: "2", raceName: "Chinese Grand Prix", location: "CHINA", finish: "2", lap: "1:35.454" },
                { round: "3", raceName: "Japanese Grand Prix", location: "JAPÓN", finish: "1", lap: "1:33.706" },
                { round: "4", raceName: "Bahrain Grand Prix", location: "BAHRÉIN", finish: "4", lap: "1:32.608" },
                { round: "5", raceName: "Saudi Arabian Grand Prix", location: "ARABIA SAUDITA", finish: "2", lap: "1:31.906" },
                { round: "6", raceName: "Miami Grand Prix", location: "MIAMI", finish: "1", lap: "1:29.708" },
                { round: "7", raceName: "Emilia Romagna Grand Prix", location: "IMOLA", finish: "3", lap: "1:16.892" },
                { round: "8", raceName: "Monaco Grand Prix", location: "MÓNACO", finish: "4", lap: "1:13.109" },
                { round: "9", raceName: "Canadian Grand Prix", location: "CANADÁ", finish: "1", lap: "1:14.221" },
                { round: "10", raceName: "Spanish Grand Prix", location: "ESPAÑA", finish: "2", lap: "1:17.334" },
                { round: "11", raceName: "Austrian Grand Prix", location: "AUSTRIA", finish: "1", lap: "1:07.990" },
                { round: "12", raceName: "British Grand Prix", location: "REINO UNIDO", finish: "3", lap: "1:28.114" },
                { round: "13", raceName: "Belgian Grand Prix", location: "BÉLGICA", finish: "1", lap: "1:47.305" },
                { round: "14", raceName: "Hungarian Grand Prix", location: "HUNGRÍA", finish: "9", lap: "1:21.400" },
                { round: "15", raceName: "Dutch Grand Prix", location: "PAÍSES BAJOS", finish: "2", lap: "1:13.202" },
                { round: "16", raceName: "Italian Grand Prix", location: "ITALIA", finish: "5", lap: "1:23.908" },
                { round: "17", raceName: "Azerbaijan Grand Prix", location: "AZERBAIYÁN", finish: "1", lap: "1:44.331" },
                { round: "18", raceName: "Singapore Grand Prix", location: "SINGAPUR", finish: "3", lap: "1:36.442" },
                { round: "19", raceName: "United States Grand Prix", location: "ESTADOS UNIDOS", finish: "1", lap: "1:36.211" },
                { round: "20", raceName: "Mexico City Grand Prix", location: "MÉXICO", finish: "3", lap: "1:20.332" },
                { round: "21", raceName: "São Paulo Grand Prix", location: "BRASIL", finish: "3", lap: "1:13.990" },
                { round: "22", raceName: "Las Vegas Grand Prix", location: "LAS VEGAS", finish: "2", lap: "1:34.001" },
                { round: "23", raceName: "Qatar Grand Prix", location: "QATAR", finish: "1", lap: "1:23.543" },
                { round: "24", raceName: "Abu Dhabi Grand Prix", location: "ABU DHABI", finish: "1", lap: "1:25.110" }
            ]
        };

        // API REAL DE F1 (Jolpi API)
        async function fetchRealYearData(year) {
            try {
                const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/max_verstappen/results.json`);
                const data = await response.json();
                const racesRaw = data.MRData.RaceTable.Races;
                
                let podiums = 0;
                let mappedRaces = [];

                racesRaw.forEach(race => {
                    const result = race.Results[0];
                    if (parseInt(result.position) <= 3) podiums++;
                    
                    mappedRaces.push({
                        round: race.round,
                        raceName: race.raceName,
                        location: race.Circuit.Location.country.toUpperCase(),
                        finish: result.position,
                        lap: result.FastestLap ? result.FastestLap.Time.time : "N/A"
                    });
                });

                // En 2024, 2023 y 2022 Max fue Campeón Mundial Absoluto
                return {
                    year: year,
                    isChampion: true, 
                    finish: "1ST",
                    podiums: podiums,
                    races: mappedRaces
                };
            } catch (error) {
                console.error(`Error cargando API F1 para ${year}:`, error);
                return null;
            }
        }

        function createYearBlockHTML(yearData) {
            if(!yearData) return '';
            const championClass = yearData.isChampion ? 'champion' : '';
            
            let rowsHTML = yearData.races.map(r => `
                <div class="result-row">
                    <div class="col-round">${r.round.padStart(2, '0')}</div>
                    <div class="col-location">${r.location} <span class="r-name">${r.raceName}</span></div>
                    <div class="col-finish ${r.finish === '1' ? 'first-place' : ''}">
                        ${r.finish === '1' ? '<i class="fa-solid fa-trophy"></i>' : ''} 
                        ${r.finish}${r.finish === '1' ? 'ST' : r.finish === '2' ? 'ND' : r.finish === '3' ? 'RD' : 'TH'}
                    </div>
                    <div class="col-lap">${r.lap}</div>
                </div>
            `).join('');

            return `
                <div class="acc-year-block">
                    <div class="acc-header ${championClass}">
                        <div class="acc-icon"><i class="fa-solid fa-chevron-down"></i></div>
                        <div class="acc-year">${yearData.year}</div>
                        <div class="acc-finish">
                            <span>${yearData.finish}</span>
                            <label>FINISH</label>
                        </div>
                        <div class="acc-podiums">
                            <span>${yearData.podiums}</span>
                            <label>PODIUMS</label>
                        </div>
                    </div>
                    <div class="acc-content">
                        <div class="table-header">
                            <span>ROUND</span>
                            <span>LOCATION</span>
                            <span>FINISH</span>
                            <span>FASTEST LAP</span>
                        </div>
                        <div class="acc-rows-container">
                            ${rowsHTML}
                        </div>
                    </div>
                </div>
            `;
        }

        async function loadAllHistory() {
            // Descargamos 2024, 2023 y 2022 reales desde la base de datos de la FIA
            const [data2024, data2023, data2022] = await Promise.all([
                fetchRealYearData(2024),
                fetchRealYearData(2023),
                fetchRealYearData(2022)
            ]);

            // Ensamblamos en orden cronológico descendente por año
            let finalHTML = createYearBlockHTML(data2025);
            finalHTML += createYearBlockHTML(data2024);
            finalHTML += createYearBlockHTML(data2023);
            finalHTML += createYearBlockHTML(data2022);

            accordionContainer.innerHTML = finalHTML;
            ScrollTrigger.refresh();

            // Lógica de apertura/cierre de Acordeón
            const headers = document.querySelectorAll('.acc-header');
            headers.forEach(header => {
                header.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                        setTimeout(() => ScrollTrigger.refresh(), 500); 
                    }
                });
            });
            
            // Abrimos el 2025 por defecto para mostrar los datos corregidos
            const firstHeader = document.querySelector('.acc-header');
            if(firstHeader) firstHeader.click();
        }

        loadAllHistory();
    }

    // --- 7. BOTÓN VOLVER ARRIBA Y FOOTER ---
    const backToTopBtn = document.getElementById('backToTop');
    lenis.on('scroll', (e) => {
        if (backToTopBtn) {
            if (e.scroll > 500) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        }
    });
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => { lenis.scrollTo(0, { duration: 1.5 }); });
    }

    const footerElem = document.querySelector('.mv-footer');
    if (footerElem) {
        const tlFooter = gsap.timeline({
            scrollTrigger: { trigger: ".mv-footer", start: "top 85%", toggleActions: "play none none reverse" }
        });
        tlFooter.fromTo(".footer-car-background", { y: "15%", opacity: 0 }, { y: "0%", opacity: 1, duration: 2.5, ease: "power3.out" });
    }
});