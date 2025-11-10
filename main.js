// Canvas untuk efek background yang lebih kompleks
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set ukuran canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Efek partikel yang lebih kompleks
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.alpha = Math.random() * 0.6 + 0.1;
        this.color = `rgba(139, 0, 0, ${this.alpha})`;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Jika partikel keluar dari canvas, reset posisinya
        if (this.x < -this.size || this.x > canvas.width + this.size) {
            this.x = Math.random() * canvas.width;
        }
        if (this.y < -this.size || this.y > canvas.height + this.size) {
            this.y = Math.random() * canvas.height;
        }

        // Efek pulsating
        this.alpha = 0.3 + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3;
        this.color = `rgba(139, 0, 0, ${this.alpha})`;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = '#8B0000';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Efek kabut darah
class BloodMist {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 200 + 100;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.1 + 0.05;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Jika kabut keluar dari canvas, reset posisinya
        if (this.x < -this.size || this.x > canvas.width + this.size) {
            this.x = Math.random() * canvas.width;
        }
        if (this.y < -this.size || this.y > canvas.height + this.size) {
            this.y = Math.random() * canvas.height;
        }
    }

    draw() {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(139, 0, 0, ${this.alpha})`);
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Efek retakan seperti kaca pecah
class Crack {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.width = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.3 + 0.1;
    }

    draw() {
        ctx.strokeStyle = `rgba(139, 0, 0, ${this.alpha})`;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle) * this.length,
            this.y + Math.sin(this.angle) * this.length
        );
        ctx.stroke();
    }
}

// Membuat efek visual
const particles = [];
const bloodMists = [];
const cracks = [];

// Inisialisasi partikel
for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
}

// Inisialisasi kabut darah
for (let i = 0; i < 8; i++) {
    bloodMists.push(new BloodMist());
}

// Inisialisasi retakan
for (let i = 0; i < 20; i++) {
    cracks.push(new Crack());
}

// Floating particles untuk foreground
function createFloatingParticles() {
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.background = `rgba(139, 0, 0, ${Math.random() * 0.5 + 0.2})`;
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(255, 0, 0, 0.5)`;
        
        document.body.appendChild(particle);
        
        // Animasi floating
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = Math.random() * 20000 + 10000;
    const keyframes = [
        { 
            transform: `translate(0, 0)`,
            opacity: Math.random() * 0.5 + 0.2
        },
        { 
            transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`,
            opacity: Math.random() * 0.5 + 0.2
        }
    ];
    
    const animation = particle.animate(keyframes, {
        duration: duration,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });
}

// Fungsi animasi utama
function animate() {
    // Clear canvas dengan efek fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar retakan (statis)
    cracks.forEach(crack => {
        crack.draw();
    });

    // Update dan draw kabut darah
    bloodMists.forEach(mist => {
        mist.update();
        mist.draw();
    });

    // Update dan draw partikel
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Efek vignette
    const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
}

// Handle resize window
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Efek suara yang lebih kompleks
function playButtonSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'play') {
        // Sound untuk tombol PLAY (lebih dramatis)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } else {
        // Sound untuk tombol CONTINUE
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// Event listeners untuk tombol
document.querySelector('.play-btn').addEventListener('click', function() {
    playButtonSound('play');
    
    // Efek visual saat tombol diklik
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
    
    // Simulasi loading game
    simulateGameStart();
});

document.querySelector('.continue-btn').addEventListener('click', function() {
    playButtonSound('continue');
    
    // Efek visual saat tombol diklik
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
    
    // Simulasi continue game
    simulateGameContinue();
});

// Simulasi aksi game
function simulateGameStart() {
    const originalText = document.querySelector('.play-btn .btn-text').textContent;
    document.querySelector('.play-btn .btn-text').textContent = 'LOADING...';
    
    setTimeout(() => {
        document.querySelector('.play-btn .btn-text').textContent = originalText;
        // Di sini bisa redirect ke game atau tampilkan scene berikutnya
        console.log('Game started!');
    }, 2000);
}

function simulateGameContinue() {
    const originalText = document.querySelector('.continue-btn .btn-text').textContent;
    document.querySelector('.continue-btn .btn-text').textContent = 'LOADING...';
    
    setTimeout(() => {
        document.querySelector('.continue-btn .btn-text').textContent = originalText;
        console.log('Game continued!');
    }, 1500);
}

// Inisialisasi
createFloatingParticles();
animate();

// Tambahkan floating particles secara berkala
setInterval(createFloatingParticles, 3000);

