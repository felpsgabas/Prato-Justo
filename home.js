/**
 * JavaScript para a página inicial do Prato Justo
 * Gerencia navegação, animações, scroll suave e interações do usuário
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== REFERÊNCIAS DOS ELEMENTOS =====
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const screens = document.querySelectorAll('.screen');
    const navigationButtons = document.querySelectorAll('[data-navigate]');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    // Estado atual da navegação
    let currentScreen = 'inicio';
    let isTransitioning = false;
    
    // ===== SISTEMA DE NAVEGAÇÃO ENTRE TELAS =====
    
    /**
     * Navega para uma tela específica
     * @param {string} targetScreen - ID da tela de destino
     * @param {string} direction - Direção da animação ('next' ou 'prev')
     */
    function navigateToScreen(targetScreen, direction = 'next') {
        if (isTransitioning || targetScreen === currentScreen) return;
        
        isTransitioning = true;
        
        const currentScreenElement = document.querySelector(`[data-screen="${currentScreen}"]`);
        const targetScreenElement = document.querySelector(`[data-screen="${targetScreen}"]`);
        
        if (!targetScreenElement) {
            console.error(`Tela "${targetScreen}" não encontrada`);
            isTransitioning = false;
            return;
        }
        
        // Prepara a tela de destino
        targetScreenElement.style.display = 'flex';
        targetScreenElement.classList.remove('prev', 'next');
        targetScreenElement.classList.add(direction === 'next' ? 'next' : 'prev');
        
        // Força o reflow para garantir que as classes sejam aplicadas
        targetScreenElement.offsetHeight;
        
        // Anima para a tela de destino
        setTimeout(() => {
            currentScreenElement.classList.remove('active');
            currentScreenElement.classList.add(direction === 'next' ? 'prev' : 'next');
            
            targetScreenElement.classList.remove('prev', 'next');
            targetScreenElement.classList.add('active');
            
            // Atualiza navegação ativa
            updateActiveNavigation(targetScreen);
            
            // Finaliza a transição
            setTimeout(() => {
                currentScreenElement.style.display = 'none';
                currentScreenElement.classList.remove('prev', 'next');
                
                currentScreen = targetScreen;
                isTransitioning = false;
                
                // Executa animações da nova tela
                initScreenAnimations(targetScreen);
                
            }, 500);
        }, 50);
    }
    
    /**
     * Atualiza a navegação ativa no header e indicadores
     * @param {string} activeScreen - ID da tela ativa
     */
    function updateActiveNavigation(activeScreen) {
        // Atualiza navegação do header
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-navigate') === activeScreen) {
                link.classList.add('active');
            }
        });
        
        // Atualiza indicadores laterais
        indicatorDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-screen') === activeScreen) {
                dot.classList.add('active');
            }
        });
    }
    
    /**
     * Inicializa animações específicas de cada tela
     * @param {string} screenId - ID da tela
     */
    function initScreenAnimations(screenId) {
        const screenElement = document.querySelector(`[data-screen="${screenId}"]`);
        if (!screenElement) return;
        
        // Reinicia animações AOS para a tela atual
        const animatedElements = screenElement.querySelectorAll('[data-aos]');
        animatedElements.forEach(element => {
            element.classList.remove('aos-animate');
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.classList.add('aos-animate');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        });
        
        // Animações específicas por tela
        switch(screenId) {
            case 'sobre':
                // Reinicia contadores da seção sobre
                initCounters();
                break;
            case 'cadastrar-alimentos':
                // Reinicia status de localização
                const locationStatus = document.getElementById('locationStatus');
                if (locationStatus) {
                    locationStatus.textContent = 'Localização não detectada';
                    locationStatus.style.color = '#7f8c8d';
                }
                break;
        }
    }
    
    /**
     * Inicializa o sistema de navegação
     */
    function initScreenNavigation() {
        // Mostra a tela inicial
        const initialScreen = document.querySelector(`[data-screen="${currentScreen}"]`);
        if (initialScreen) {
            initialScreen.style.display = 'flex';
            initialScreen.classList.add('active');
        }
        
        // Adiciona event listeners para todos os botões de navegação
        navigationButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetScreen = this.getAttribute('data-navigate');
                
                if (targetScreen) {
                    // Determina a direção baseada na posição atual e destino
                    const screens = ['inicio', 'como-funciona', 'parceiros', 'cadastrar-alimentos', 'sobre'];
                    const currentIndex = screens.indexOf(currentScreen);
                    const targetIndex = screens.indexOf(targetScreen);
                    
                    const direction = targetIndex > currentIndex ? 'next' : 'prev';
                    navigateToScreen(targetScreen, direction);
                }
            });
        });
        
        // Adiciona event listeners para os indicadores laterais
        indicatorDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const targetScreen = this.getAttribute('data-screen');
                
                if (targetScreen && targetScreen !== currentScreen) {
                    // Determina a direção baseada na posição atual e destino
                    const screens = ['inicio', 'como-funciona', 'parceiros', 'cadastrar-alimentos', 'sobre'];
                    const currentIndex = screens.indexOf(currentScreen);
                    const targetIndex = screens.indexOf(targetScreen);
                    
                    const direction = targetIndex > currentIndex ? 'next' : 'prev';
                    navigateToScreen(targetScreen, direction);
                }
            });
        });
        
        // Suporte a navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (isTransitioning) return;
            
            const screens = ['inicio', 'como-funciona', 'parceiros', 'cadastrar-alimentos', 'sobre'];
            const currentIndex = screens.indexOf(currentScreen);
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        navigateToScreen(screens[currentIndex - 1], 'prev');
                    }
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < screens.length - 1) {
                        navigateToScreen(screens[currentIndex + 1], 'next');
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    navigateToScreen('inicio', 'prev');
                    break;
                case 'End':
                    e.preventDefault();
                    navigateToScreen('sobre', 'next');
                    break;
            }
        });
    }
    
    // ===== MENU MOBILE =====
    
    /**
     * Alterna a visibilidade do menu mobile
     */
    function toggleMobileMenu() {
        navList.classList.toggle('active');
        
        // Anima o ícone do hambúrguer
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navList.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    /**
     * Fecha o menu mobile quando um link é clicado
     */
    function closeMobileMenu() {
        navList.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
    
    // Event listeners para o menu mobile
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Fecha o menu quando um link é clicado
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fecha o menu quando clica fora dele
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && navList.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Links de navegação já são tratados pelo sistema de telas
    
    // Header mantém estilo fixo no sistema de telas
    
    // ===== ANIMAÇÕES DE SCROLL =====
    
    /**
     * Verifica se um elemento está visível na viewport
     * @param {HTMLElement} element - Elemento a ser verificado
     * @returns {boolean} - True se visível, false caso contrário
     */
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * Adiciona animação de fade-in aos elementos quando entram na viewport
     */
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('aos-animate')) {
                element.classList.add('aos-animate');
                
                // Adiciona delay baseado no atributo data-aos-delay
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, parseInt(delay));
            }
        });
    }
    
    // Inicializa elementos com animação
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }
    
    // Inicializa animações e adiciona event listener
    initScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Executa uma vez no carregamento para elementos já visíveis
    handleScrollAnimations();
    
    // ===== CONTADOR ANIMADO DAS ESTATÍSTICAS =====
    
    /**
     * Anima os números das estatísticas
     * @param {HTMLElement} element - Elemento que contém o número
     * @param {number} target - Valor final do contador
     * @param {number} duration - Duração da animação em ms
     */
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    /**
     * Inicializa os contadores animados quando a seção sobre entra na viewport
     */
    function initCounters() {
        const statsSection = document.querySelector('.about');
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (isElementInViewport(statsSection)) {
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                
                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    
                    // Anima o número
                    if (text.includes('+')) {
                        animateCounter(stat, number, 2000);
                    } else if (text.includes('T')) {
                        animateCounter(stat, number * 10, 2000);
                        setTimeout(() => {
                            stat.textContent = text;
                        }, 2000);
                    } else {
                        animateCounter(stat, number, 2000);
                    }
                }
            });
        }
    }
    
    // Adiciona event listener para os contadores
    window.addEventListener('scroll', initCounters);
    
    // ===== EFEITOS DE HOVER NOS CARDS =====
    
    /**
     * Adiciona efeitos de hover aos cards da seção "Como Funciona"
     */
    function initCardHoverEffects() {
        const stepCards = document.querySelectorAll('.step-card');
        
        stepCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Inicializa efeitos de hover
    initCardHoverEffects();
    
    // ===== BOTÕES DE AÇÃO =====
    
    /**
     * Adiciona efeitos de loading aos botões principais
     */
    function initButtonEffects() {
        const primaryButtons = document.querySelectorAll('.btn-primary');
        
        primaryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Cria efeito de ripple
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                // Remove o ripple após a animação
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Inicializa efeitos dos botões
    initButtonEffects();
    
    // Navegação ativa é gerenciada pelo sistema de telas
    
    // Otimizações de performance não são necessárias sem scroll
    
    // ===== GEOLOCALIZAÇÃO =====
    
    /**
     * Inicializa funcionalidades de geolocalização
     */
    function initGeolocation() {
        const getLocationBtn = document.getElementById('getLocationBtn');
        const locationStatus = document.getElementById('locationStatus');
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        
        if (!getLocationBtn || !locationStatus) return;
        
        getLocationBtn.addEventListener('click', function() {
            if (!navigator.geolocation) {
                locationStatus.textContent = 'Geolocalização não suportada pelo navegador';
                locationStatus.style.color = '#e74c3c';
                return;
            }
            
            locationStatus.textContent = 'Obtendo localização...';
            locationStatus.style.color = '#f39c12';
            getLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Simula busca de endereço (em produção, usar API de geocoding)
                    reverseGeocode(lat, lng, function(address) {
                        locationStatus.textContent = 'Localização obtida com sucesso!';
                        locationStatus.style.color = '#27ae60';
                        
                        if (address) {
                            addressInput.value = address.street || '';
                            cityInput.value = address.city || 'São Paulo';
                        }
                        
                        getLocationBtn.disabled = false;
                    });
                },
                function(error) {
                    let errorMessage = 'Erro ao obter localização: ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Permissão negada';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Localização indisponível';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Tempo limite excedido';
                            break;
                        default:
                            errorMessage += 'Erro desconhecido';
                    }
                    
                    locationStatus.textContent = errorMessage;
                    locationStatus.style.color = '#e74c3c';
                    getLocationBtn.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }
    
    /**
     * Simula geocodificação reversa (em produção, usar API real)
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {Function} callback - Callback com o endereço
     */
    function reverseGeocode(lat, lng, callback) {
        // Simula delay de API
        setTimeout(() => {
            // Dados simulados baseados na localização
            const address = {
                street: `Rua das Flores, ${Math.floor(Math.random() * 1000) + 1}`,
                city: 'São Paulo',
                state: 'SP'
            };
            callback(address);
        }, 1500);
    }
    
    // ===== FORMULÁRIO DE CADASTRO DE ALIMENTOS =====
    
    /**
     * Inicializa validação do formulário de cadastro de alimentos
     */
    function initFoodRegistrationForm() {
        const form = document.getElementById('foodRegistrationForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const foodData = {
                name: formData.get('foodName'),
                type: formData.get('foodType'),
                quantity: formData.get('quantity'),
                expiryDate: formData.get('expiryDate'),
                description: formData.get('description'),
                address: formData.get('address'),
                city: formData.get('city')
            };
            
            // Validação básica
            if (!validateFoodForm(foodData)) {
                return;
            }
            
            // Simula envio do formulário
            submitFoodRegistration(foodData);
        });
    }
    
    /**
     * Valida dados do formulário de alimentos
     * @param {Object} data - Dados do formulário
     * @returns {boolean} - True se válido
     */
    function validateFoodForm(data) {
        const errors = [];
        
        if (!data.name.trim()) {
            errors.push('Nome do alimento é obrigatório');
        }
        
        if (!data.type) {
            errors.push('Tipo do alimento é obrigatório');
        }
        
        if (!data.quantity.trim()) {
            errors.push('Quantidade é obrigatória');
        }
        
        if (!data.expiryDate) {
            errors.push('Data de validade é obrigatória');
        } else {
            const expiryDate = new Date(data.expiryDate);
            const today = new Date();
            if (expiryDate < today) {
                errors.push('Data de validade não pode ser no passado');
            }
        }
        
        if (!data.address.trim()) {
            errors.push('Endereço é obrigatório');
        }
        
        if (!data.city.trim()) {
            errors.push('Cidade é obrigatória');
        }
        
        if (errors.length > 0) {
            alert('Por favor, corrija os seguintes erros:\n' + errors.join('\n'));
            return false;
        }
        
        return true;
    }
    
    /**
     * Simula envio do formulário de cadastro de alimentos
     * @param {Object} data - Dados do formulário
     */
    function submitFoodRegistration(data) {
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        
        // Simula delay de processamento
        setTimeout(() => {
            console.log('Dados do alimento cadastrado:', data);
            
            // Simula sucesso
            alert('Alimento cadastrado com sucesso! Ele aparecerá para pessoas próximas à sua localização.');
            
            // Reset do formulário
            document.getElementById('foodRegistrationForm').reset();
            document.getElementById('locationStatus').textContent = 'Localização não detectada';
            document.getElementById('locationStatus').style.color = '#7f8c8d';
            
            // Reset do botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
        }, 2000);
    }
    
    // ===== INICIALIZAÇÃO FINAL =====
    
    /**
     * Executa todas as inicializações necessárias
     */
    function init() {
        // Adiciona classe de carregamento completo
        document.body.classList.add('loaded');
        
        // Inicializa o sistema de navegação entre telas
        initScreenNavigation();
        
        // Executa animações iniciais da tela atual
        initScreenAnimations(currentScreen);
        
        // Inicializa funcionalidades específicas
        initGeolocation();
        initFoodRegistrationForm();
        
        // Log de inicialização (para debug)
        console.log('Prato Justo - Sistema de telas inicializado com sucesso!');
    }
    
    // Executa inicialização
    init();
    
    // ===== TRATAMENTO DE ERROS =====
    
    /**
     * Trata erros globais da aplicação
     * @param {Error} error - Erro capturado
     */
    window.addEventListener('error', function(error) {
        console.error('Erro na aplicação:', error);
        // Aqui você pode adicionar lógica para reportar erros
    });
    
    /**
     * Trata erros de promises não capturadas
     * @param {Event} event - Evento de erro
     */
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Promise rejeitada:', event.reason);
        // Aqui você pode adicionar lógica para reportar erros de promises
    });
});

// ===== ESTILOS CSS ADICIONAIS VIA JAVASCRIPT =====

// Adiciona estilos para o efeito ripple
const style = document.createElement('style');
style.textContent = `
    .btn-primary {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .aos-animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
