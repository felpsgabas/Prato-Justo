/**
 * JavaScript para a página de Cadastro do Prato Justo
 * Gerencia validação de formulário, força da senha e interações do usuário
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const cadastroForm = document.getElementById('cadastroForm');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Elementos de erro
    const nomeError = document.getElementById('nomeError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

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
     * Calcula a força da senha
     * @param {string} password - Senha a ser analisada
     * @returns {object} - Objeto com nível e texto da força
     */
    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        // Critérios de validação
        if (password.length >= 8) score += 1;
        else feedback.push('Pelo menos 8 caracteres');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Letras minúsculas');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Letras maiúsculas');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Números');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('Caracteres especiais');
        
        // Determina o nível de força
        let level, text;
        if (score < 2) {
            level = 'weak';
            text = 'Senha fraca';
        } else if (score < 3) {
            level = 'medium';
            text = 'Senha média';
        } else if (score < 4) {
            level = 'strong';
            text = 'Senha forte';
        } else {
            level = 'very-strong';
            text = 'Senha muito forte';
        }
        
        return { level, text, feedback };
    }

    /**
     * Atualiza o indicador de força da senha
     * @param {string} password - Senha atual
     */
    function updatePasswordStrength(password) {
        let strengthIndicator = document.querySelector('.password-strength');
        
        // Cria o indicador se não existir
        if (!strengthIndicator) {
            strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength';
            strengthIndicator.innerHTML = '<div class="password-strength-bar"></div><div class="password-strength-text"></div>';
            passwordInput.parentNode.appendChild(strengthIndicator);
        }
        
        if (password.length === 0) {
            strengthIndicator.style.display = 'none';
            return;
        }
        
        strengthIndicator.style.display = 'block';
        const strength = calculatePasswordStrength(password);
        
        // Atualiza classes e conteúdo
        strengthIndicator.className = `password-strength ${strength.level}`;
        strengthIndicator.querySelector('.password-strength-text').textContent = strength.text;
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
     * Valida o campo de nome
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validateNomeField() {
        const nome = nomeInput.value.trim();
        
        if (!nome) {
            showError(nomeError, 'Nome completo é obrigatório');
            addErrorClass(nomeInput);
            return false;
        }
        
        if (nome.length < 2) {
            showError(nomeError, 'Nome deve ter pelo menos 2 caracteres');
            addErrorClass(nomeInput);
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
            showError(nomeError, 'Nome deve conter apenas letras e espaços');
            addErrorClass(nomeInput);
            return false;
        }
        
        clearError(nomeError);
        removeErrorClass(nomeInput);
        return true;
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
     * Valida o campo de confirmação de senha
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validateConfirmPasswordField() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!confirmPassword) {
            showError(confirmPasswordError, 'Confirmação de senha é obrigatória');
            addErrorClass(confirmPasswordInput);
            return false;
        }
        
        if (password !== confirmPassword) {
            showError(confirmPasswordError, 'As senhas não coincidem');
            addErrorClass(confirmPasswordInput);
            return false;
        }
        
        clearError(confirmPasswordError);
        removeErrorClass(confirmPasswordInput);
        return true;
    }

    /**
     * Valida todo o formulário
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validateForm() {
        const isNomeValid = validateNomeField();
        const isEmailValid = validateEmailField();
        const isPasswordValid = validatePasswordField();
        const isConfirmPasswordValid = validateConfirmPasswordField();
        
        return isNomeValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }

    /**
     * Simula o processo de cadastro
     * @param {object} userData - Dados do usuário
     */
    function performCadastro(userData) {
        // Simula delay de processamento
        const submitButton = cadastroForm.querySelector('.btn-primary');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Cadastrando...';
        
        // Simula requisição para o servidor
        setTimeout(() => {
            // Aqui você faria a requisição real para o backend
            console.log('Dados de cadastro:', userData);
            
            // Simula sucesso do cadastro
            alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            
            // Reset do botão
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Redireciona para a página de login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        }, 2000);
    }

    // Event listeners para validação em tempo real
    nomeInput.addEventListener('blur', validateNomeField);
    nomeInput.addEventListener('input', function() {
        if (nomeInput.classList.contains('error')) {
            validateNomeField();
        }
    });

    emailInput.addEventListener('blur', validateEmailField);
    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('error')) {
            validateEmailField();
        }
    });

    passwordInput.addEventListener('blur', validatePasswordField);
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
        if (passwordInput.classList.contains('error')) {
            validatePasswordField();
        }
        // Revalida confirmação se já foi preenchida
        if (confirmPasswordInput.value) {
            validateConfirmPasswordField();
        }
    });

    confirmPasswordInput.addEventListener('blur', validateConfirmPasswordField);
    confirmPasswordInput.addEventListener('input', function() {
        if (confirmPasswordInput.classList.contains('error')) {
            validateConfirmPasswordField();
        }
    });

    // Event listener para o envio do formulário
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Previne o envio padrão do formulário
        
        if (validateForm()) {
            const userData = {
                nome: nomeInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };
            
            performCadastro(userData);
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
