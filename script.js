// ============================================
        // GÉNÉRATION DES ÉTOILES
        // ============================================
        const starsContainer = document.getElementById('starsContainer');
        const stars = [];

        function createStars() {
            // Couche 1 : 150 petites étoiles lointaines
            for (let i = 0; i < 150; i++) {
                createStar(1, 0.05);
            }

            // Couche 2 : 80 étoiles moyennes
            for (let i = 0; i < 80; i++) {
                createStar(2, 0.2);
            }

            // Couche 3 : 30 grandes étoiles proches
            for (let i = 0; i < 30; i++) {
                createStar(3, 0.4);
            }
        }

        function createStar(layer, parallaxSpeed) {
            const star = document.createElement('div');
            star.className = `star layer-${layer}`;
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const twinkleDuration = 2 + Math.random() * 3;
            const twinkleDelay = Math.random() * 5;
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.animationDuration = `${twinkleDuration}s`;
            star.style.animationDelay = `${twinkleDelay}s`;
            
            starsContainer.appendChild(star);
            
            stars.push({
                element: star,
                initialY: y,
                parallaxSpeed: parallaxSpeed,
                layer: layer
            });
        }

        // ============================================
        // EFFET PARALLAXE AU SCROLL
        // ============================================
        let lastScrollY = 0;

        function updateParallax() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            stars.forEach(star => {
                // Calcul de la nouvelle position avec parallaxe
                const offset = scrollY * star.parallaxSpeed;
                const newY = star.initialY + (offset / windowHeight * 100);
                
                // Repositionner l'étoile si elle sort de l'écran
                let finalY = newY % 200;
                if (finalY > 100) {
                    finalY = finalY - 200;
                }
                
                star.element.style.transform = `translateY(${finalY}vh)`;
            });
            
            lastScrollY = scrollY;
        }

        // Écouter le scroll avec throttle pour optimiser les performances
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initialisation
        createStars();
        updateParallax();

        // ============================================
        // PARTICULES INTERACTIVES
        // ============================================
        const particlesContainer = document.getElementById('particlesContainer');
        const cursorGlow = document.getElementById('cursorGlow');
        
        let mouseX = 0;
        let mouseY = 0;
        let particles = [];
        let lastParticleTime = 0;
        const particleInterval = 30; // ms entre chaque particule

        // Suivi du curseur
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Mettre à jour la position du glow
            cursorGlow.style.left = mouseX + 'px';
            cursorGlow.style.top = mouseY + 'px';
            
            // Créer des particules
            const currentTime = Date.now();
            if (currentTime - lastParticleTime > particleInterval) {
                createParticle(mouseX, mouseY);
                lastParticleTime = currentTime;
            }
        });

        // Agrandir le glow au clic
        document.addEventListener('mousedown', () => {
            cursorGlow.classList.add('active');
            // Créer une explosion de particules
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    const angle = (Math.PI * 2 * i) / 15;
                    const distance = 30 + Math.random() * 20;
                    const x = mouseX + Math.cos(angle) * distance;
                    const y = mouseY + Math.sin(angle) * distance;
                    createParticle(x, y, true);
                }, i * 20);
            }
        });

        document.addEventListener('mouseup', () => {
            cursorGlow.classList.remove('active');
        });

        function createParticle(x, y, isExplosion = false) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position initiale
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            particlesContainer.appendChild(particle);
            
            // Mouvement de la particule
            const angle = Math.random() * Math.PI * 2;
            const velocity = isExplosion ? 2 + Math.random() * 3 : 0.5 + Math.random() * 1;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            const particleData = {
                element: particle,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                life: 0,
                maxLife: 2000,
                isExplosion: isExplosion
            };
            
            particles.push(particleData);
            
            // Créer des lignes de connexion avec les particules proches
            if (!isExplosion && particles.length > 1) {
                const nearbyParticles = particles.slice(-5, -1);
                nearbyParticles.forEach(otherParticle => {
                    if (otherParticle.element.parentNode) {
                        const dx = otherParticle.x - x;
                        const dy = otherParticle.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            createConnectionLine(x, y, otherParticle.x, otherParticle.y);
                        }
                    }
                });
            }
            
            // Supprimer après animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
                particles = particles.filter(p => p.element !== particle);
            }, 2000);
        }

        function createConnectionLine(x1, y1, x2, y2) {
            const line = document.createElement('div');
            line.className = 'connection-line';
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            line.style.width = length + 'px';
            line.style.left = x1 + 'px';
            line.style.top = y1 + 'px';
            line.style.transform = `rotate(${angle}deg)`;
            
            particlesContainer.appendChild(line);
            
            // Supprimer après animation
            setTimeout(() => {
                if (line.parentNode) {
                    line.remove();
                }
            }, 800);
        }

        // Animation des particules
        function animateParticles() {
            particles.forEach(particle => {
                particle.life += 16;
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Friction
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                
                if (particle.element.parentNode) {
                    particle.element.style.left = particle.x + 'px';
                    particle.element.style.top = particle.y + 'px';
                }
            });
            
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        // ============================================
        // ANIMATIONS DE SCROLL - RÉVÉLATION DES SECTIONS
        // ============================================
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observer toutes les box
        document.querySelectorAll('.box').forEach(box => {
            observer.observe(box);
        });

        // Animation au scroll - effet de glitch sur les titres
        const titles = document.querySelectorAll('h2');
        let lastScrollTop = 0;
        
        function checkTitleIntersection() {
            const scrollTop = window.scrollY;
            const viewportCenter = window.innerHeight / 2 + scrollTop;
            
            // Détecter si on scroll activement
            const isScrolling = Math.abs(scrollTop - lastScrollTop) > 5;
            
            if (isScrolling) {
                titles.forEach(title => {
                    const rect = title.getBoundingClientRect();
                    const titleY = rect.top + scrollTop;
                    
                    // Glitch quand on passe près du titre
                    if (Math.abs(viewportCenter - titleY) < 100) {
                        title.style.animation = 'glitch 0.3s ease';
                        setTimeout(() => {
                            title.style.animation = '';
                        }, 300);
                    }
                });
            }
            
            lastScrollTop = scrollTop;
        }

        window.addEventListener('scroll', checkTitleIntersection);

        // Animation de glitch
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0%, 100% {
                    transform: translate(0);
                    text-shadow: 0 0 20px rgba(162, 89, 255, 0.8);
                }
                25% {
                    transform: translate(-2px, 2px);
                    text-shadow: -2px 0 rgba(191, 33, 159, 0.8), 2px 0 rgba(162, 143, 255, 0.8);
                }
                50% {
                    transform: translate(2px, -2px);
                    text-shadow: 2px 0 rgba(162, 143, 255, 0.8), -2px 0 rgba(191, 33, 159, 0.8);
                }
                75% {
                    transform: translate(-2px, -2px);
                    text-shadow: 0 0 30px rgba(162, 89, 255, 1);
                }
            }
        `;
        document.head.appendChild(style);