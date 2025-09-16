/**
 * JavaScript para a página de Login do Prato Justo
 * Gerencia validação de formulário e interações do usuário
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    /**
     * Valida o formato do e-mail
     * @param {string} email - E-mail a ser validado
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Exibe mensagem de erro em um campo
     * @param {HTMLElement} errorElement - Elemento que exibe o erro
     * @param {string} message - Mensagem de erro
     */
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Remove mensagem de erro de um campo
     * @param {HTMLElement} errorElement - Elemento que exibe o erro
     */
    function clearError(errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    /**
     * Adiciona classe de erro ao input
     * @param {HTMLElement} input - Campo de input
     */
    function addErrorClass(input) {
        input.classList.add('error');
    }

    /**
     * Remove classe de erro do input
     * @param {HTMLElement} input - Campo de input
     */
    function removeErrorClass(input) {
        input.classList.remove('error');
    }

    /**
     * Valida o campo de e-mail
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validateEmailField() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showError(emailError, 'E-mail é obrigatório');
            addErrorClass(emailInput);
            return false;
        }
        
        if (!validateEmail(email)) {
            showError(emailError, 'Por favor, insira um e-mail válido');
            addErrorClass(emailInput);
            return false;
        }
        
        clearError(emailError);
        removeErrorClass(emailInput);
        return true;
    }

    /**
     * Valida o campo de senha
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validatePasswordField() {
        const password = passwordInput.value;
        
        if (!password) {
            showError(passwordError, 'Senha é obrigatória');
            addErrorClass(passwordInput);
            return false;
        }
        
        if (password.length < 6) {
            showError(passwordError, 'A senha deve ter pelo menos 6 caracteres');
            addErrorClass(passwordInput);
            return false;
        }
        
        clearError(passwordError);
        removeErrorClass(passwordInput);
        return true;
    }

    /**
     * Valida todo o formulário
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validateForm() {
        const isEmailValid = validateEmailField();
        const isPasswordValid = validatePasswordField();
        
        return isEmailValid && isPasswordValid;
    }

    /**
     * Simula o processo de login
     * @param {string} email - E-mail do usuário
     * @param {string} password - Senha do usuário
     */
    function performLogin(email, password) {
        // Simula delay de processamento
        const submitButton = loginForm.querySelector('.btn-primary');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
        
        // Simula requisição para o servidor
        setTimeout(() => {
            // Aqui você faria a requisição real para o backend
            console.log('Tentativa de login:', { email, password });
            
            // Simula sucesso do login
            alert('Login realizado com sucesso!');
            
            // Reset do botão
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Aqui você redirecionaria para a página principal
            // window.location.href = 'dashboard.html';
            
        }, 1500);
    }

    // Event listeners para validação em tempo real
    emailInput.addEventListener('blur', validateEmailField);
    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('error')) {
            validateEmailField();
        }
    });

    passwordInput.addEventListener('blur', validatePasswordField);
    passwordInput.addEventListener('input', function() {
        if (passwordInput.classList.contains('error')) {
            validatePasswordField();
        }
    });

    // Event listener para o envio do formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Previne o envio padrão do formulário
        
        if (validateForm()) {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            performLogin(email, password);
        }
    });

    // Adiciona efeito de foco suave nos inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Adiciona animação de entrada para os elementos
    const cardElements = document.querySelectorAll('.card-header, .login-form, .form-footer');
    cardElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});
