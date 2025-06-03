document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const btnLogin2 = document.querySelector('.btn-login2');
    
    if (loginForm && btnLogin2) {
        // Validação do lado do cliente antes do envio
        loginForm.addEventListener('submit', function(event) {
            const CNPJ = document.getElementById('CNPJ').value.trim();                const senha = document.getElementById('Senha').value.trim();
            
            if (!CNPJ || !senha) {
                event.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios.');
                
                // Destaca campos vazios
                if (!CNPJ) {
                    document.getElementById('CNPJ').style.border = '2px solid red';
                }
                if (!senha) {
                    document.getElementById('senha').style.border = '2px solid red';
                }
            }
            
            // Se tudo estiver preenchido, o formulário será enviado para login.php
            // O PHP fará a validação final e redirecionará se as credenciais estiverem corretas
        });
        
        // Remove o destaque quando o usuário começa a digitar
        document.getElementById('CNPJ').addEventListener('input', function() {
            this.style.border = '';
        });
        
        document.getElementById('senha').addEventListener('input', function() {
            this.style.border = '';
        });
    }
});
