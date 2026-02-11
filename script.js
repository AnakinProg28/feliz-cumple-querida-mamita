document.addEventListener('DOMContentLoaded', () => {
    console.log('Birthday website loaded!');

    // ===== IMAGE MODAL LIGHTBOX =====
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close');
    const galleryImages = document.querySelectorAll('.gallery-item img');

    // Open modal when clicking on gallery images
    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            modal.classList.add('show');
            modalImg.src = this.src;
            captionText.textContent = this.alt || 'Foto';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal when clicking the X button
    closeBtn.addEventListener('click', function () {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Allow scrolling again
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // ===== HEART EXPLOSION =====
    const heartBtn = document.getElementById('heartBtn');
    const heartExplosion = document.getElementById('heartExplosion');

    if (heartBtn && heartExplosion) {
        let disabled = false;
        heartBtn.addEventListener('click', function (e) {
            if (disabled) return;
            disabled = true;
            setTimeout(() => disabled = false, 250); // small debounce to avoid floods

            // Emoji options
            const emojis = ['❤️', '💖', '💗', '💓', '✨', '😍', '🥰'];
            const count = 30; // reasonable number to avoid performance issues

            for (let i = 0; i < count; i++) {
                const heart = document.createElement('div');
                heart.classList.add('exploding-heart');
                heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

                // Random angle and distance for explosion
                const angle = Math.random() * Math.PI * 2;
                const distance = 60 + Math.random() * 180; // px
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance - (10 + Math.random() * 40);

                // Random rotation and size
                const rot = Math.floor(Math.random() * 360);
                const size = 18 + Math.floor(Math.random() * 32);

                heart.style.setProperty('--tx', tx + 'px');
                heart.style.setProperty('--ty', ty + 'px');
                heart.style.setProperty('--r', rot + 'deg'); // matches CSS var --r
                heart.style.left = '50%';
                heart.style.top = '50%';
                heart.style.fontSize = size + 'px';

                heartExplosion.appendChild(heart);

                // Remove heart after animation ends
                heart.addEventListener('animationend', () => heart.remove(), { once: true });
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.message-card, .gallery-item, h2');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('fade-in');
                element.style.opacity = '1'; // Ensure it stays visible
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Confetti Effect (Simple implementation)
    const startConfetti = () => {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);

        const colors = ['#d4af37', '#c2185b', '#fce4ec', '#gold'];

        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -20 + 'px';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            const animationDuration = Math.random() * 3 + 3 + 's';
            const animationDelay = Math.random() * 5 + 's';

            confetti.style.animation = `fall ${animationDuration} linear ${animationDelay} infinite`;

            confettiContainer.appendChild(confetti);
        }

        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes fall {
                0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    };

    startConfetti();

    // Music Control
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');

    if (audio && musicBtn) {
        // Set initial volume
        audio.volume = 0.5;

        musicBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                musicBtn.textContent = '⏸️'; // Pause icon
                musicBtn.classList.add('playing');
                musicBtn.title = "Pausar música";
            } else {
                audio.pause();
                musicBtn.textContent = '🎵'; // Music icon
                musicBtn.classList.remove('playing');
                musicBtn.title = "Reproducir música";
            }
        });

        // Try to start playback on the first user interaction (prevents autoplay block)
        document.body.addEventListener('click', () => {
            if (audio.paused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicBtn.textContent = '⏸️';
                        musicBtn.classList.add('playing');
                        musicBtn.title = 'Pausar música';
                    }).catch((err) => {
                        console.warn('No se pudo reproducir automáticamente:', err);
                    });
                }
            }
        }, { once: true });
    }
});
