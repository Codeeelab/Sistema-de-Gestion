// main.js: Lógica de interacción y almacenamiento local mejorada

// Declarar particlesJS y gsap para evitar errores de "undeclared"
let particlesJS, gsap;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema
    initTheme();
    
    // Inicializar partículas
    if (typeof particlesJS !== 'undefined') {
        initParticles();
    }

    // Gestión de carritos
    const carritos = document.querySelectorAll('.carrito, .carrito-admin');
    let disponibles = 0;
    let ocupados = 0;
    let reservados = 0;
    
    carritos.forEach(carrito => {
        const id = carrito.getAttribute('data-id');
        const estadoSpan = carrito.querySelector('.estado');
        const estadoText = carrito.querySelector('.estado-text');
        const botonesAdmin = carrito.querySelectorAll('.cambiar-estado');
        
        // Obtener estado del localStorage o establecer como "Libre" por defecto
        let estado = localStorage.getItem(`carrito${id}`) || 'Libre';
        
        // Actualizar el texto del estado
        estadoSpan.textContent = estado;
        if (estadoText) {
            if (estado === 'Libre') {
                estadoText.textContent = 'Disponible';
            } else if (estado === 'Reservado') {
                estadoText.textContent = 'Reservado';
            } else {
                estadoText.textContent = 'Ocupado';
            }
        }
        
        // Actualizar el atributo data-status
        carrito.setAttribute('data-status', estado.toLowerCase());
        
        // Contar carritos por estado
        if (estado === 'Libre') {
            disponibles++;
        } else if (estado === 'Reservado') {
            reservados++;
        } else {
            ocupados++;
        }

        // Configurar los botones de cambio de estado en la página de admin
        if (botonesAdmin.length > 0) {
            botonesAdmin.forEach(boton => {
                const btnText = boton.querySelector('.btn-text');
                const action = boton.getAttribute('data-action');
                
                // Establecer texto inicial del botón según el estado actual
                if (action === 'ocupar') {
                    if (estado === 'Ocupado') {
                        btnText.textContent = 'Marcar como Libre';
                    } else {
                        btnText.textContent = 'Marcar como Ocupado';
                    }
                } else if (action === 'reservar') {
                    if (estado === 'Reservado') {
                        btnText.textContent = 'Marcar como Libre';
                    } else {
                        btnText.textContent = 'Reservar';
                    }
                }
                
                // Añadir evento de clic
                boton.addEventListener('click', () => {
                    // Determinar el nuevo estado según el botón y el estado actual
                    let nuevoEstado;
                    
                    if (action === 'ocupar') {
                        nuevoEstado = estado === 'Ocupado' ? 'Libre' : 'Ocupado';
                    } else if (action === 'reservar') {
                        nuevoEstado = estado === 'Reservado' ? 'Libre' : 'Reservado';
                    }
                    
                    // Guardar en localStorage
                    localStorage.setItem(`carrito${id}`, nuevoEstado);
                    
                    // Actualizar el texto del estado
                    estadoSpan.textContent = nuevoEstado;
                    if (estadoText) {
                        if (nuevoEstado === 'Libre') {
                            estadoText.textContent = 'Disponible';
                        } else if (nuevoEstado === 'Reservado') {
                            estadoText.textContent = 'Reservado';
                        } else {
                            estadoText.textContent = 'Ocupado';
                        }
                    }
                    
                    // Actualizar el atributo data-status
                    carrito.setAttribute('data-status', nuevoEstado.toLowerCase());
                    
                    // Actualizar texto de los botones
                    botonesAdmin.forEach(btn => {
                        const btnTxt = btn.querySelector('.btn-text');
                        const btnAction = btn.getAttribute('data-action');
                        
                        if (btnAction === 'ocupar') {
                            btnTxt.textContent = nuevoEstado === 'Ocupado' ? 'Marcar como Libre' : 'Marcar como Ocupado';
                        } else if (btnAction === 'reservar') {
                            btnTxt.textContent = nuevoEstado === 'Reservado' ? 'Marcar como Libre' : 'Reservar';
                        }
                    });
                    
                    // Añadir animación de cambio
                    carrito.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        carrito.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);
                    
                    // Actualizar estado para la lógica local
                    estado = nuevoEstado;
                    
                    // Actualizar contadores
                    actualizarContadores();
                });
            });
        }
    });
    
    // Actualizar contadores iniciales
    const countDisponibles = document.getElementById('count-disponibles');
    const countOcupados = document.getElementById('count-ocupados');
    const countReservados = document.getElementById('count-reservados');
    
    if (countDisponibles) countDisponibles.textContent = disponibles;
    if (countOcupados) countOcupados.textContent = ocupados;
    if (countReservados) countReservados.textContent = reservados;
    
    // Función para actualizar contadores
      countReservados.textContent = reservados;
    
    // Función para actualizar contadores
    function actualizarContadores() {
        let disp = 0;
        let ocup = 0;
        let reser = 0;
        
        carritos.forEach(carrito => {
            const status = carrito.getAttribute('data-status');
            if (status === 'libre') {
                disp++;
            } else if (status === 'reservado') {
                reser++;
            } else {
                ocup++;
            }
        });
        
        if (countDisponibles) countDisponibles.textContent = disp;
        if (countOcupados) countOcupados.textContent = ocup;
        if (countReservados) countReservados.textContent = reser;
    }
    
    // Filtrado de carritos
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase activa al botón clickeado
            button.classList.add('active');
            
            // Obtener el filtro
            const filter = button.getAttribute('data-filter');
            
            // Aplicar filtro
            carritos.forEach(carrito => {
                if (filter === 'todos') {
                    carrito.style.display = 'block';
                } else {
                    const status = carrito.getAttribute('data-status');
                    carrito.style.display = status === filter ? 'block' : 'none';
                }
            });
        });
    });
    
    // Animaciones con GSAP si está disponible
    if (typeof gsap !== 'undefined') {
        // Animación para las tarjetas de estadísticas
        gsap.from('.stat-card', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.5
        });
        
        // Animación para los carritos
        gsap.from('.carrito, .carrito-admin', {
            duration: 0.8,
            scale: 0.9,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 1
        });
    }
    
    // Actualizar la hora de última actualización
    const updateTimes = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        document.querySelectorAll('.detail-value:not(.estado-text)').forEach(el => {
            el.textContent = timeString;
        });
    };
    
    // Actualizar la hora inicial
    updateTimes();
    
    // Actualizar la hora cada minuto
    setInterval(updateTimes, 60000);
    
    // Cambio de tema
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    // Función para inicializar el tema
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.className = savedTheme + '-mode';
    }
    
    // Función para cambiar el tema
    function toggleTheme() {
        const currentTheme = document.documentElement.className.includes('light') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.className = newTheme + '-mode';
        localStorage.setItem('theme', newTheme);
        
        // Actualizar partículas si están disponibles
        if (typeof particlesJS !== 'undefined') {
            initParticles();
        }
    }
    
    // Función para inicializar partículas según el tema
    function initParticles() {
        const isDarkMode = document.documentElement.className.includes('dark');
        const particleColor = isDarkMode ? '#818cf8' : '#4361ee';
        const lineColor = isDarkMode ? '#818cf8' : '#4361ee';
        
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": particleColor
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": lineColor,
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
});