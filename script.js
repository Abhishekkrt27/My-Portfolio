/**
 * Abhishek Kumar Thakur - Portfolio Script
 * BULLETPROOF version: Each section is isolated with try/catch.
 * Swiper uses setTimeout instead of transitionend to avoid bubbling issues.
 */

document.addEventListener('DOMContentLoaded', () => {

    const colors = {
        accent: '#8B5E3C',
        sage: '#D3D4C0',
        deepblue: '#0A2947',
        bg: '#FFFFFF'
    };
    let speedFactor = 1.0;
    let particleCount = 70;
    let particlesArray = [];

    // ==========================================================================
    // 1. Header Navigation
    // ==========================================================================
    try {
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            if (header) header.classList.toggle('scrolled', window.scrollY > 50);
            let currentSectionId = '';
            sections.forEach(s => {
                const top = s.offsetTop - 150;
                if (window.scrollY >= top && window.scrollY < top + s.clientHeight) {
                    currentSectionId = s.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + currentSectionId);
            });
        });

        if (mobileNavToggle) {
            mobileNavToggle.addEventListener('click', () => {
                navbar.classList.toggle('active');
                const icon = mobileNavToggle.querySelector('i');
                icon.className = navbar.classList.contains('active')
                    ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered';
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar) navbar.classList.remove('active');
                const icon = mobileNavToggle ? mobileNavToggle.querySelector('i') : null;
                if (icon) icon.className = 'fa-solid fa-bars-staggered';
            });
        });
    } catch (e) { console.warn('Section 1 (Nav) error:', e); }

    // ==========================================================================
    // 2. Typing Text Animation
    // ==========================================================================
    try {
        const typedTextSpan = document.querySelector('.typed-text');
        if (typedTextSpan) {
            const textArray = ["Designer.", "C++ Developer.", "Problem Solver.", "ML Explorer."];
            let textIdx = 0, charIdx = 0;
            function typeChar() {
                if (charIdx < textArray[textIdx].length) {
                    typedTextSpan.textContent += textArray[textIdx].charAt(charIdx);
                    charIdx++;
                    setTimeout(typeChar, 120);
                } else { setTimeout(eraseChar, 2000); }
            }
            function eraseChar() {
                if (charIdx > 0) {
                    typedTextSpan.textContent = textArray[textIdx].substring(0, charIdx - 1);
                    charIdx--;
                    setTimeout(eraseChar, 60);
                } else {
                    textIdx = (textIdx + 1) % textArray.length;
                    setTimeout(typeChar, 600);
                }
            }
            setTimeout(typeChar, 1000);
        }
    } catch (e) { console.warn('Section 2 (Typing) error:', e); }

    // ==========================================================================
    // 3. Particle Network Background
    // ==========================================================================
    try {
        const mainCanvas = document.getElementById('particle-canvas');
        if (mainCanvas) {
            const ctx = mainCanvas.getContext('2d');
            let mouse = { x: null, y: null, radius: 150 };

            window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
            window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

            function resizeMainCanvas() {
                mainCanvas.width = window.innerWidth;
                mainCanvas.height = window.innerHeight;
                initParticles();
            }
            window.addEventListener('resize', resizeMainCanvas);
            resizeMainCanvas();

            class Particle {
                constructor(x, y, dx, dy, size, color) {
                    this.x = x; this.y = y; this.dx = dx; this.dy = dy;
                    this.size = size; this.color = color;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
                update() {
                    if (this.x > mainCanvas.width || this.x < 0) this.dx = -this.dx;
                    if (this.y > mainCanvas.height || this.y < 0) this.dy = -this.dy;
                    if (mouse.x !== null && mouse.y !== null) {
                        let dx = mouse.x - this.x, dy = mouse.y - this.y;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < mouse.radius) {
                            let force = (mouse.radius - dist) / mouse.radius;
                            this.x += (dx / dist) * force * 1.5;
                            this.y += (dy / dist) * force * 1.5;
                        }
                    }
                    this.x += this.dx * speedFactor;
                    this.y += this.dy * speedFactor;
                    this.draw();
                }
            }

            window._initParticles = function initParticles() {
                particlesArray = [];
                for (let i = 0; i < particleCount; i++) {
                    let size = Math.random() * 2 + 1;
                    particlesArray.push(new Particle(
                        Math.random() * mainCanvas.width,
                        Math.random() * mainCanvas.height,
                        (Math.random() - 0.5) * 0.8,
                        (Math.random() - 0.5) * 0.8,
                        size,
                        Math.random() > 0.5 ? colors.accent : colors.deepblue
                    ));
                }
            };
            // alias
            var initParticles = window._initParticles;

            function connectParticles() {
                for (let a = 0; a < particlesArray.length; a++) {
                    for (let b = a + 1; b < particlesArray.length; b++) {
                        let dx = particlesArray[a].x - particlesArray[b].x;
                        let dy = particlesArray[a].y - particlesArray[b].y;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.strokeStyle = 'rgba(10,41,71,' + ((1 - dist / 120) * 0.12) + ')';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            function animateParticles() {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                particlesArray.forEach(p => p.update());
                connectParticles();
                requestAnimationFrame(animateParticles);
            }
            animateParticles();
        }
    } catch (e) { console.warn('Section 3 (Particles) error:', e); }

    // ==========================================================================
    // 4. 3D Tilt on Skill Cards
    // ==========================================================================
    try {
        document.querySelectorAll('.skill-logo-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const rx = ((r.height / 2 - (e.clientY - r.top)) / (r.height / 2)) * 6;
                const ry = (((e.clientX - r.left) - r.width / 2) / (r.width / 2)) * 6;
                card.style.transition = 'transform 0.1s ease';
                card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.02,1.02,1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s ease';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
            });
        });
    } catch (e) { console.warn('Section 4 (Tilt) error:', e); }

    // ==========================================================================
    // 5. DESIGN CAROUSEL — Infinite Loop with Autoplay
    //    Uses setTimeout for animation completion instead of transitionend
    // ==========================================================================
    try {
        const container = document.getElementById('design-swiper');
        const wrapper = container.querySelector('.swiper-wrapper');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsBox = document.querySelector('.swiper-dots-container');

        // Remove CSS transition from wrapper — JS controls all transitions
        wrapper.style.transition = 'none';

        const origSlides = Array.from(wrapper.children);
        const N = origSlides.length; // 10

        // Clone ALL slides before AND after for seamless infinite scroll
        // Layout: [clone of all N] [original N] [clone of all N]
        // Indices:  0..N-1          N..2N-1       2N..3N-1
        // We start at index N (first original slide)

        // Append clones of all originals AFTER
        origSlides.forEach(function (slide) {
            var clone = slide.cloneNode(true);
            clone.classList.add('clone');
            wrapper.appendChild(clone);
        });

        // Prepend clones of all originals BEFORE (in reverse to maintain order)
        for (var i = N - 1; i >= 0; i--) {
            var clone = origSlides[i].cloneNode(true);
            clone.classList.add('clone');
            wrapper.insertBefore(clone, wrapper.firstChild);
        }

        const allSlides = Array.from(wrapper.children); // 3N total
        let idx = N; // start at first original slide
        let animating = false;

        const ANIM_DURATION = 500;
        const AUTOPLAY_DELAY = 2500;

        function getGap() {
            return window.innerWidth <= 768 ? 15 : 25;
        }

        function getSlideWidth() {
            return origSlides[0].offsetWidth || 270;
        }

        function computeTranslate(index) {
            const sw = getSlideWidth();
            const gap = getGap();
            const center = (container.offsetWidth - sw) / 2;
            return -(index * (sw + gap)) + center;
        }

        function setPosition(index, animate) {
            const tx = computeTranslate(index);

            if (animate) {
                wrapper.style.transition = 'transform ' + ANIM_DURATION + 'ms ease';
            } else {
                wrapper.style.transition = 'none';
            }

            wrapper.style.transform = 'translateX(' + tx + 'px)';

            // Update active class
            allSlides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
            updateDots();
        }

        function goTo(newIndex, animate) {
            if (animating) return;
            idx = newIndex;

            if (animate) {
                animating = true;
                setPosition(idx, true);

                setTimeout(function () {
                    animating = false;

                    // Teleport if we've scrolled into clone territory
                    // Forward: if idx >= 2N (entered the appended clones), jump back to N
                    if (idx >= 2 * N) {
                        idx = idx - N;
                        setPosition(idx, false);
                    }
                    // Backward: if idx < N (entered the prepended clones), jump forward to N..2N-1
                    else if (idx < N) {
                        idx = idx + N;
                        setPosition(idx, false);
                    }
                }, ANIM_DURATION + 30);
            } else {
                setPosition(idx, false);
            }
        }

        function goNext() { goTo(idx + 1, true); }
        function goPrev() { goTo(idx - 1, true); }

        // ---- Dots ----
        function buildDots() {
            dotsBox.innerHTML = '';
            for (let i = 0; i < N; i++) {
                const d = document.createElement('div');
                d.className = 'swiper-dot';
                d.addEventListener('click', function () {
                    pauseAutoTemporarily();
                    goTo(i + N, true); // originals start at index N
                });
                dotsBox.appendChild(d);
            }
        }

        function updateDots() {
            // Map idx back to 0..N-1 range
            let mapped = ((idx - N) % N + N) % N; // proper modulo for negatives
            Array.from(dotsBox.children).forEach(function (d, i) {
                d.classList.toggle('active', i === mapped);
            });
        }

        // ---- Autoplay ----
        let autoTimer = null;
        let pauseTimer = null;

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => {
                goNext();
            }, AUTOPLAY_DELAY);
        }

        function stopAuto() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        function pauseAutoTemporarily() {
            stopAuto();
            if (pauseTimer) clearTimeout(pauseTimer);
            pauseTimer = setTimeout(() => { startAuto(); }, 5000);
        }

        // ---- Buttons ----
        if (prevBtn) prevBtn.addEventListener('click', () => { pauseAutoTemporarily(); goPrev(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { pauseAutoTemporarily(); goNext(); });

        // ---- Drag / Swipe ----
        let dragStartX = 0;
        let dragCurrentX = 0;
        let dragStartTranslate = 0;
        let dragging = false;
        let didDrag = false;

        function onPointerDown(e) {
            if (animating) return;
            dragging = true;
            didDrag = false;

            if (e.type === 'touchstart') {
                dragStartX = e.touches[0].clientX;
            } else {
                dragStartX = e.clientX;
                e.preventDefault(); // prevent text selection while dragging
            }
            dragCurrentX = dragStartX;

            // Read current transform
            const style = window.getComputedStyle(wrapper);
            const matrix = style.transform;
            if (matrix && matrix !== 'none') {
                dragStartTranslate = parseFloat(matrix.split(',')[4]);
            } else {
                dragStartTranslate = computeTranslate(idx);
            }

            wrapper.style.transition = 'none';
        }

        function onPointerMove(e) {
            if (!dragging) return;

            if (e.type === 'touchmove') {
                dragCurrentX = e.touches[0].clientX;
            } else {
                dragCurrentX = e.clientX;
            }

            const diff = dragCurrentX - dragStartX;
            if (Math.abs(diff) > 5) didDrag = true;

            wrapper.style.transform = 'translateX(' + (dragStartTranslate + diff) + 'px)';
        }

        function onPointerUp(e) {
            if (!dragging) return;
            dragging = false;

            const diff = dragCurrentX - dragStartX;
            if (diff < -50) {
                pauseAutoTemporarily();
                goNext();
            } else if (diff > 50) {
                pauseAutoTemporarily();
                goPrev();
            } else {
                // Snap back to current position
                setPosition(idx, true);
                setTimeout(() => { /* ensure transition resets */ }, ANIM_DURATION);
            }
        }

        container.addEventListener('mousedown', onPointerDown);
        container.addEventListener('touchstart', onPointerDown, { passive: true });
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('touchmove', onPointerMove, { passive: true });
        document.addEventListener('mouseup', onPointerUp);
        document.addEventListener('touchend', onPointerUp);

        // ---- Image Lightbox (click to view full-screen) ----
        const lightbox = document.getElementById('image-lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        // Use event delegation on wrapper — works for originals AND clones
        wrapper.addEventListener('click', (e) => {
            // Ignore if user was dragging
            if (didDrag) return;

            const card = e.target.closest('.design-card');
            if (!card) return;

            const img = card.querySelector('.card-img-holder img');
            if (!img || !img.src) return;

            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            stopAuto();
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            startAuto();
        }

        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
                closeLightbox();
            }
        });

        // ---- Resize ----
        window.addEventListener('resize', () => { setPosition(idx, false); });

        // ---- INIT ----
        buildDots();
        // Use two nested rAFs to guarantee layout is fully settled
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setPosition(idx, false);
                startAuto();
                console.log('Swiper initialized: ' + N + ' slides, autoplay started');
            });
        });

    } catch (e) { console.error('Section 5 (Swiper) error:', e); }


    // ==========================================================================
    // 6. Coding Project Modals
    // ==========================================================================
    try {
        const projectDetailsData = {
            alumni: {
                title: "AlumniConnect Portal",
                tag: "Development / Connection Hub",
                description: "AlumniConnect is a modern directory platform bridging the professional gap between alumni and current university students.",
                challenge: "Implementing a clean matching queue that suggests alumni based on matching criteria in real-time.",
                solution: "Created an in-memory hashing index categorizing expertise tags, resolving matching suggestions instantly.",
                tech: ["HTML5", "CSS Grid", "JavaScript (ES6)", "NodeJS", "WebSockets"],
                link: "https://github.com/Abhishekkrt27"
            },
            algo: {
                title: "Algorithm Engine Visualizer",
                tag: "Development / DSA Engine",
                description: "A graphical sandbox visualizing sorting, pathfinding, and custom tree algorithms in real-time.",
                challenge: "Rendering algorithm steps sequentially without blocking the main rendering thread.",
                solution: "Structured algorithms using generator functions and async intervals for canvas redraw updates.",
                tech: ["C++ Logic", "Canvas Drawing", "DSA Generators", "Async Scheduling"],
                link: "https://github.com/Abhishekkrt27"
            },
            fintech: {
                title: "Fintech Analytics Dashboard",
                tag: "Development / Finance",
                description: "A high-performance dashboard featuring real-time data tracking, security metrics, and interactive widgets.",
                challenge: "Handling high-frequency updates of transaction records and rendering data visualizations smoothly.",
                solution: "Implemented canvas-based charting and virtualized lists to handle rendering hundreds of nodes per second.",
                tech: ["React.js", "D3.js", "Chart.js", "Tailwind CSS"],
                link: "https://github.com/Abhishekkrt27"
            },
            editorial: {
                title: "Premium Editorial Portfolio",
                tag: "Development / UI/UX",
                description: "A content-focused editorial layout optimized for readability, responsive spacing, and smooth transitions.",
                challenge: "Creating smooth page transition animations without page reload lag.",
                solution: "Utilized GSAP ScrollTrigger and vanilla JS page-state routing to animate elements asynchronously.",
                tech: ["HTML5", "CSS3", "GSAP", "JavaScript"],
                link: "https://github.com/Abhishekkrt27"
            },
            brand: {
                title: "Brand Identity Landing Page",
                tag: "Development / E-Commerce",
                description: "A luxury cosmetics landing page showing product catalog grids, interactive filters, and sleek checkout flows.",
                challenge: "Rendering high-resolution product imagery and 3D mockups performantly.",
                solution: "Optimized image loading via WebP formats and lazy-loaded assets, integrating basic CSS 3D perspectives.",
                tech: ["HTML5", "CSS3", "WebGL", "JavaScript"],
                link: "https://github.com/Abhishekkrt27"
            }
        };

        const modal = document.getElementById('project-modal');
        const modalClose = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('.modal-content');

        document.querySelectorAll('.project-card').forEach(card => {
            const imgWrapper = card.querySelector('.project-img-wrapper');
            if (imgWrapper) {
                imgWrapper.addEventListener('click', () => {
                    const img = card.querySelector('.project-thumb-img');
                    let type = 'alumni';
                    if (img) {
                        if (img.src.includes('alumni')) type = 'alumni';
                        else if (img.src.includes('algo')) type = 'algo';
                        else if (img.src.includes('fintech')) type = 'fintech';
                        else if (img.src.includes('editorial')) type = 'editorial';
                        else if (img.src.includes('brand')) type = 'brand';
                    }
                    const data = projectDetailsData[type];
                    if (!data) return;

                    modalContent.innerHTML =
                        '<div class="modal-project-header">' +
                        '<span class="modal-project-tag">' + data.tag + '</span>' +
                        '<h3 class="modal-project-title">' + data.title + '</h3>' +
                        '</div>' +
                        '<div class="modal-project-body">' +
                        '<div class="modal-project-desc">' +
                        '<h4>Overview</h4><p>' + data.description + '</p>' +
                        '<h4>The Challenge</h4><p>' + data.challenge + '</p>' +
                        '<h4>The Solution</h4><p>' + data.solution + '</p>' +
                        '</div>' +
                        '<div class="modal-project-meta-panel">' +
                        '<div class="meta-group"><label>Role</label><span>Designer & Lead Engineer</span></div>' +
                        '<div class="meta-group"><label>Tech Stack</label>' +
                        '<div class="meta-tech-list">' + data.tech.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="meta-group"><label>Links</label>' +
                        '<div class="modal-project-actions">' +
                        '<a href="' + data.link + '" target="_blank" class="btn btn-primary"><span>Code Base <i class="fa-brands fa-github"></i></span></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (modalClose) modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

        // Escape key for both modal and lightbox
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeModal();
                var lb = document.getElementById('image-lightbox');
                if (lb && lb.classList.contains('active')) {
                    lb.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    } catch (e) { console.warn('Section 6 (Modals) error:', e); }

    // ==========================================================================
    // 7. Playground Gravity Engine
    // ==========================================================================
    try {
        const playCanvas = document.getElementById('playground-canvas');
        if (playCanvas) {
            const playCtx = playCanvas.getContext('2d');
            let orbitsArray = [];
            let playMouse = { x: null, y: null, active: false };

            function resizePlayCanvas() {
                const r = playCanvas.parentElement.getBoundingClientRect();
                playCanvas.width = r.width;
                playCanvas.height = r.height;
            }
            window.addEventListener('resize', resizePlayCanvas);
            resizePlayCanvas();
            setTimeout(resizePlayCanvas, 300);

            class Orbit {
                constructor(x, y, radius, angle, color) {
                    this.ox = x; this.oy = y;
                    this.radius = radius; this.angle = angle;
                    this.omega = Math.random() * 0.05 + 0.02;
                    this.color = color;
                }
                draw() {
                    const ox = this.ox + Math.cos(this.angle) * this.radius;
                    const oy = this.oy + Math.sin(this.angle) * this.radius;
                    playCtx.beginPath();
                    playCtx.arc(ox, oy, 5, 0, Math.PI * 2);
                    playCtx.fillStyle = this.color;
                    playCtx.fill();
                    playCtx.strokeStyle = 'rgba(10,41,71,0.05)';
                    playCtx.beginPath();
                    playCtx.moveTo(this.ox, this.oy);
                    playCtx.lineTo(ox, oy);
                    playCtx.stroke();
                }
                update() {
                    this.angle += this.omega * speedFactor;
                    this.radius = Math.max(10, this.radius - 0.1);
                    this.draw();
                }
            }

            playCanvas.addEventListener('mousemove', function (e) {
                const r = playCanvas.getBoundingClientRect();
                playMouse.x = e.clientX - r.left;
                playMouse.y = e.clientY - r.top;
                if (playMouse.active && orbitsArray.length < 150) spawnOrbit(playMouse.x, playMouse.y);
            });
            playCanvas.addEventListener('mousedown', function () {
                playMouse.active = true;
                spawnOrbit(playMouse.x, playMouse.y);
            });
            window.addEventListener('mouseup', function () { playMouse.active = false; });

            function spawnOrbit(cx, cy) {
                if (cx === null || cy === null) return;
                for (let i = 0; i < 3; i++) {
                    orbitsArray.push(new Orbit(cx, cy, Math.random() * 60 + 20, Math.random() * Math.PI * 2,
                        Math.random() > 0.5 ? colors.accent : colors.deepblue));
                }
                if (orbitsArray.length > 200) orbitsArray.splice(0, 10);
            }

            function animatePlayground() {
                playCtx.fillStyle = 'rgba(255,255,255,0.2)';
                playCtx.fillRect(0, 0, playCanvas.width, playCanvas.height);
                orbitsArray.forEach(function (o) { o.update(); });
                orbitsArray = orbitsArray.filter(function (o) { return o.radius > 11; });
                requestAnimationFrame(animatePlayground);
            }
            animatePlayground();
        }
    } catch (e) { console.warn('Section 7 (Playground) error:', e); }

    // ==========================================================================
    // 8. Color Picker Controls
    // ==========================================================================
    try {
        const inputSpeed = document.getElementById('particle-speed');
        const inputCount = document.getElementById('particle-count');
        const displaySpeed = document.getElementById('speed-val');
        const displayCount = document.getElementById('count-val');
        const pickerAccent = document.getElementById('color-accent');
        const pickerSage = document.getElementById('color-sage');
        const pickerDeepBlue = document.getElementById('color-deepblue');
        const resetBtn = document.querySelector('.btn-reset-playground');

        if (inputSpeed) inputSpeed.addEventListener('input', function (e) {
            speedFactor = parseFloat(e.target.value);
            if (displaySpeed) displaySpeed.textContent = speedFactor.toFixed(1) + 'x';
        });
        if (inputCount) inputCount.addEventListener('input', function (e) {
            particleCount = parseInt(e.target.value);
            if (displayCount) displayCount.textContent = particleCount;
            if (window._initParticles) window._initParticles();
        });

        function hexToRgb(hex) {
            const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
        }
        function updateColors() {
            document.documentElement.style.setProperty('--accent-primary', colors.accent);
            document.documentElement.style.setProperty('--sage-cream', colors.sage);
            document.documentElement.style.setProperty('--text-primary', colors.deepblue);
            document.documentElement.style.setProperty('--text-secondary', colors.deepblue);
            const rgb = hexToRgb(colors.accent);
            if (rgb) document.documentElement.style.setProperty('--accent-primary-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
        }

        if (pickerAccent) pickerAccent.addEventListener('input', function (e) { colors.accent = e.target.value; updateColors(); });
        if (pickerSage) pickerSage.addEventListener('input', function (e) { colors.sage = e.target.value; updateColors(); });
        if (pickerDeepBlue) pickerDeepBlue.addEventListener('input', function (e) { colors.deepblue = e.target.value; updateColors(); });

        if (resetBtn) resetBtn.addEventListener('click', function () {
            colors.accent = '#8B5E3C'; colors.sage = '#D3D4C0'; colors.deepblue = '#0A2947';
            if (pickerAccent) pickerAccent.value = colors.accent;
            if (pickerSage) pickerSage.value = colors.sage;
            if (pickerDeepBlue) pickerDeepBlue.value = colors.deepblue;
            speedFactor = 1.0;
            if (inputSpeed) inputSpeed.value = 1.0;
            if (displaySpeed) displaySpeed.textContent = '1.0x';
            particleCount = 70;
            if (inputCount) inputCount.value = 70;
            if (displayCount) displayCount.textContent = '70';
            updateColors();
            if (window._initParticles) window._initParticles();
        });
    } catch (e) { console.warn('Section 8 (Controls) error:', e); }

    // ==========================================================================
    // 9. Contact Form
    // ==========================================================================
    try {
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('form-name').value.trim();
                const email = document.getElementById('form-email').value.trim();
                const subject = document.getElementById('form-subject').value.trim();
                const message = document.getElementById('form-message').value.trim();
                if (!name || !email || !subject || !message) {
                    formStatus.textContent = "Please fill in all required fields.";
                    formStatus.className = 'form-status-message error';
                    formStatus.style.display = 'block';
                    return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    formStatus.textContent = "Please enter a valid email address.";
                    formStatus.className = 'form-status-message error';
                    formStatus.style.display = 'block';
                    return;
                }

                formStatus.textContent = "Sending message...";
                formStatus.className = 'form-status-message';
                formStatus.style.display = 'block';

                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                    .then(async function (response) {
                        let jsonRes = await response.json();
                        if (response.status === 200) {
                            formStatus.textContent = 'Thank you, ' + name + '! Your message has been sent successfully.';
                            formStatus.className = 'form-status-message success';
                            contactForm.reset();
                        } else {
                            console.error(jsonRes);
                            formStatus.textContent = jsonRes.message || "Something went wrong. Please try again.";
                            formStatus.className = 'form-status-message error';
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                        formStatus.textContent = "Network error. Please try again later.";
                        formStatus.className = 'form-status-message error';
                    });
            });
        }
    } catch (e) { console.warn('Section 9 (Contact) error:', e); }

});

