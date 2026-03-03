document.addEventListener('DOMContentLoaded', () => {
    // --- Constellation Background Animation ---
    const canvas = document.getElementById("constellation-canvas");
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener("resize", function () {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    const orbs = [];
    const numOrbs = 80;

    for (let i = 0; i < numOrbs; i++) {
        orbs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x < 0 || orb.x > width) orb.vx *= -1;
            if (orb.y < 0 || orb.y > height) orb.vy *= -1;

            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#a855f7";
            ctx.fill();
        });

        for (let i = 0; i < orbs.length; i++) {
            for (let j = i + 1; j < orbs.length; j++) {
                const dx = orbs[i].x - orbs[j].x;
                const dy = orbs[i].y - orbs[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(orbs[i].x, orbs[i].y);
                    ctx.lineTo(orbs[j].x, orbs[j].y);
                    const alpha = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();




    // --- Smooth Scroll & Navigation ---
    document.querySelectorAll('.navbar a, .hero-text a, footer a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Mobile Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navAnchors.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }


    // --- Scroll Features ---
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const anchors = document.querySelectorAll('.nav-links a');
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        anchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 3D Spatial Effects (Hero & Team) ---
    // Team 3D Cards
    const teamWrappers = document.querySelectorAll('.team-spatial-wrapper');
    teamWrappers.forEach(wrapper => {
        const card = wrapper.querySelector('.team-spatial-inner');
        if (card) {
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15;
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            wrapper.addEventListener('mouseleave', () => {
                card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }
    });


    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // "Request Demo" Scroll
    document.querySelectorAll('.demo-request-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectName = btn.getAttribute('data-project');
            const contactSection = document.querySelector('#contact');

            // Scroll to contact
            contactSection.scrollIntoView({ behavior: 'smooth' });

            // Since form is removed, we just alert the user or pre-fill nothing
            // Optionally could open mailto here, but simple scroll is less intrusive
            console.log(`Záujem o demo projektu: ${projectName}`);
        });
    });

    // Privacy Modal Logic
    const privacyModal = document.getElementById("privacy-modal");
    const privacyLink = document.getElementById("privacy-link");
    const closeModalSpan = document.getElementsByClassName("close-modal")[0];

    if (privacyLink && privacyModal) {
        privacyLink.onclick = function () {
            privacyModal.style.display = "block";
        }
    }

    if (closeModalSpan && privacyModal) {
        closeModalSpan.onclick = function () {
            privacyModal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (event.target == privacyModal) {
            privacyModal.style.display = "none";
        }
    }

    // --- 3D News Carousel Logic ---
    const carouselContainer = document.getElementById("news-carousel");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (carouselContainer && carouselItems.length > 0) {
        let currAngle = 0;
        const angleStep = 360 / carouselItems.length;

        function updateCarousel() {
            const width = window.innerWidth;
            let radius = 350; // User-specified 350px for desktop

            if (width < 768) {
                radius = 200; // Mobile
            } else if (width < 1024) {
                radius = 280; // Tablet
            }

            carouselItems.forEach((item, index) => {
                const angle = angleStep * index;
                item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            });
        }

        function rotateCarousel(direction) {
            currAngle += direction * angleStep;
            carouselContainer.style.transform = `rotateY(${currAngle * -1}deg)`;
        }

        // Initialize and handle resize
        updateCarousel();
        window.addEventListener('resize', updateCarousel);

        if (prevBtn) prevBtn.addEventListener("click", () => rotateCarousel(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => rotateCarousel(1));

        setInterval(() => {
            rotateCarousel(1);
        }, 5000);
    }
});
