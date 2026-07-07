document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Crear Barra de Progreso Dinámica ---
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    // 1. Efecto de Scroll en la Barra de Navegación y Barra de Progreso
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progreso de lectura
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 2. Intersection Observer para animaciones de entrada (Fade-ins)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // 3. Botón Interactivo (Tema 5: Interacción principal)
    const btnInteractivo = document.getElementById('btn-interactivo');
    if (btnInteractivo) {
        // Tooltip para guiar al usuario
        btnInteractivo.title = "Cambia entre la estética clara y oscura de Frutiger Aero";

        btnInteractivo.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar ripple extra sobre el botón
            
            // Acción 2: Cambiar color (aplicando una clase al body) y cambiar texto
            const body = document.body;
            body.classList.toggle('dark-aero-mode');
            
            if (body.classList.contains('dark-aero-mode')) {
                // Acción 1: Mostrar mensaje dinámico personalizado
                mostrarMensajeFlotante('¡Modo Oscuro activado! 🌙');
                btnInteractivo.textContent = 'Restaurar Tema';
                btnInteractivo.style.transform = 'scale(0.95)';
                setTimeout(() => btnInteractivo.style.transform = 'scale(1)', 150);
            } else {
                mostrarMensajeFlotante('¡Tema Claro restaurado! 🌿');
                btnInteractivo.textContent = 'Modo Oscuro Aero';
                btnInteractivo.style.transform = 'scale(0.95)';
                setTimeout(() => btnInteractivo.style.transform = 'scale(1)', 150);
            }
        });
    }

    // 4. Mejoras de interacción: Burbujas interactuables (Pops!)
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        // Invitamos a hacer clic con el cursor
        bubble.style.cursor = 'crosshair';
        
        bubble.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar onda de agua grande al hacer clic aquí
            // Efecto visual de explosión
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0';
            this.style.transition = 'all 0.2s ease-out';
            
            // Crear partículas visuales (opcional, para más dinamismo)
            crearParticulasPop(e.clientX, e.clientY);
            
            // Reaparecer la burbuja después de unos segundos
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
                // Reiniciar animación css
                this.style.animation = 'none';
                this.offsetHeight; /* trigger reflow */
                this.style.animation = null; 
                this.style.opacity = '0.8';
            }, 3000);
        });
    });

    // 5. Efecto Tilt Dinámico en 3D (Interactividad avanzada)
    const glassFrames = document.querySelectorAll('.glass-frame, .speaker-inner, .feature-card, .sub-card');
    glassFrames.forEach(frame => {
        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X dentro del elemento
            const y = e.clientY - rect.top;  // Posición Y dentro del elemento
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calcular rotación (limitada a ciertos grados)
            const rotateX = ((y - centerY) / centerY) * -12; 
            const rotateY = ((x - centerX) / centerX) * 12;
            
            // Aplicar transformación 3D suave
            frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        frame.addEventListener('mouseleave', () => {
            // Restaurar a la posición original
            frame.style.transform = '';
            frame.style.transition = 'transform 0.5s ease';
        });
        
        frame.addEventListener('mouseenter', () => {
            // Remover transición para que siga al mouse en tiempo real
            frame.style.transition = 'none'; 
        });
    });

    // 6. Efecto Ondas de Agua al hacer clic en el documento
    document.addEventListener('click', function(e) {
        // No crear onda si el clic fue en un botón o enlace para no ensuciar la UI
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.speaker-inner')) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'water-ripple';
        document.body.appendChild(ripple);
        
        // Ajustar tamaño base
        const size = 100;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        
        // Posicionar en el ratón, ajustando el scroll
        ripple.style.left = (e.pageX - size/2) + 'px';
        ripple.style.top = (e.pageY - size/2) + 'px';
        
        // Limpiar el elemento después de la animación
        setTimeout(() => ripple.remove(), 800);
    });

    // 7. Síntesis de Audio Interactivo (Funcionalidad Avanzada)
    const speakerIcon = document.querySelector('.speaker-inner');
    if (speakerIcon) {
        // Invitamos a interactuar con un tooltip
        speakerIcon.title = "Haz clic para escuchar el acorde Frutiger Aero";
        
        speakerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            reproducirAcordeAmbiental();
            mostrarMensajeFlotante('🎵 Reproduciendo acorde ambiental...');
            
            // Animación visual extra
            const icon = speakerIcon.querySelector('.music-icon');
            if (icon) {
                icon.style.transform = 'scale(1.3)';
                icon.style.color = 'var(--aero-green)';
                setTimeout(() => {
                    icon.style.transform = '';
                    icon.style.color = '';
                }, 400);
            }
        });
    }

    // --- Funciones Auxiliares ---

    function reproducirAcordeAmbiental() {
        // Solo instanciar si el navegador lo soporta
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // Frecuencias para un acorde etéreo/nostálgico (ej. Cmaj9)
        const frequencies = [261.63, 329.63, 392.00, 493.88, 587.33]; 
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            // Forma de onda suave
            osc.type = 'sine'; 
            osc.frequency.value = freq;
            
            // Envolvente de volumen (Attack lento, Release largo)
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.5 + (i * 0.1));
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3 + (i * 0.5));
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 4);
        });
    }

    // Función para mostrar un mensaje flotante
    function mostrarMensajeFlotante(texto) {
        // Evitar que se acumulen muchos mensajes
        const existentes = document.querySelectorAll('.toast-mensaje');
        existentes.forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'toast-mensaje glass-panel';
        toast.innerText = texto;
        
        document.body.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0) translateX(-50%)';
        }, 10);
        
        // Desaparecer después de 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px) translateX(-50%)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Función para crear partículas al reventar una burbuja
    function crearParticulasPop(x, y) {
        for(let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'pop-particle';
            document.body.appendChild(particle);
            
            // Añadir scroll position para que no se desfase
            particle.style.left = (x + window.scrollX) + 'px';
            particle.style.top = (y + window.scrollY) + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 30 + Math.random() * 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            setTimeout(() => {
                particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 500);
        }
    }
});
