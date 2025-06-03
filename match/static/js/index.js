// Função para validar campos obrigatórios
function validarCamposObrigatorios() {
  const camposObrigatorios = ["nome", "email", "CNPJ", "senha", "confirmar_senha"]

  let todosPreenchidos = true

  camposObrigatorios.forEach((campo) => {
    const elemento = document.querySelector(`input[name="${campo}"]`)
    if (!elemento || !elemento.value.trim()) {
      todosPreenchidos = false
    }
  })

  return todosPreenchidos
}

// Função para limpar campo específico
function limparCampo(nomeCampo) {
  const campo = document.querySelector(`input[name="${nomeCampo}"]`)
  if (campo) {
    campo.value = ""
    campo.focus()
  }
}

// Função para limpar múltiplos campos
function limparCampos(campos) {
  campos.forEach((campo) => {
    const elemento = document.querySelector(`input[name="${campo}"]`)
    if (elemento) {
      elemento.value = ""
    }
  })
  // Focar no primeiro campo limpo
  if (campos.length > 0) {
    const primeiroCampo = document.querySelector(`input[name="${campos[0]}"]`)
    if (primeiroCampo) {
      primeiroCampo.focus()
    }
  }
}

// Aguardar o carregamento da página
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")

  if (form) {
    form.addEventListener("submit", (e) => {
      // Validar apenas os campos obrigatórios
      const camposPreenchidos = validarCamposObrigatorios()

      if (!camposPreenchidos) {
        e.preventDefault() // Impedir envio se campos não preenchidos
        alert("Por favor, preencha todos os campos obrigatórios.")
        return false
      }

      // Validar se as senhas coincidem
      const senha = document.querySelector('input[name="senha"]').value
      const confirmarSenha = document.querySelector('input[name="confirmar_senha"]').value

      if (senha !== confirmarSenha) {
        e.preventDefault()
        alert("As senhas não coincidem!")
        // Limpar campos de senha
        limparCampos(["senha", "confirmar_senha"])
        return false
      }

      if (senha.length < 8) {
        e.preventDefault()
        alert("A senha deve ter no mínimo 8 caracteres!")
        // Limpar campos de senha
        limparCampos(["senha", "confirmar_senha"])
        return false
      }

      // Se chegou até aqui, deixar o formulário ser enviado normalmente
      // O PHP vai processar e redirecionar se tudo der certo
      console.log("Formulário validado - enviando para PHP...")
    })
  }

  // Verificar se há parâmetro de sucesso na URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("cadastro") === "sucesso") {
    alert("Cadastro realizado com sucesso!")
  }
})




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
