// Função para formatar CEP
function formatarCEP(campo) {
  let valor = campo.value.replace(/\D/g, "")
  valor = valor.replace(/^(\d{5})(\d)/, "$1-$2")
  campo.value = valor
}

// Função para buscar endereço pela API ViaCEP
async function buscarEnderecoPorCEP(cep) {
  // Mostrar loading nos campos
  const campos = ["endereco", "bairro", "estado"]
  campos.forEach((campo) => {
    const elemento = document.querySelector(`input[name="${campo}"]`)
    if (elemento) {
      elemento.value = "Buscando..."
      elemento.disabled = true
      elemento.style.backgroundColor = "#f0f0f0"
    }
  })

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) {
      throw new Error("Erro na requisição")
    }

    const dados = await response.json()

    if (dados.erro) {
      throw new Error("CEP não encontrado")
    }

    // Preencher os campos automaticamente
    const campoEndereco = document.querySelector('input[name="endereco"]')
    const campoBairro = document.querySelector('input[name="bairro"]')
    const campoEstado = document.querySelector('input[name="estado"]')
    const campoRuaNumero = document.querySelector('input[name="rua_numero"]')
    const campoPais = document.querySelector('input[name="pais"]')

    // Habilitar e preencher campos
    campos.forEach((campo) => {
      const elemento = document.querySelector(`input[name="${campo}"]`)
      if (elemento) {
        elemento.disabled = false
        elemento.style.backgroundColor = ""
      }
    })

    if (campoEndereco) {
      campoEndereco.value = dados.logradouro || ""
    }

    if (campoBairro) {
      campoBairro.value = dados.bairro || ""
    }

    if (campoEstado) {
      campoEstado.value = dados.uf || ""
    }

    if (campoRuaNumero) {
      // Preencher com o logradouro e deixar espaço para o número
      campoRuaNumero.value = dados.logradouro ? dados.logradouro + ", " : ""
      campoRuaNumero.focus() // Focar para o usuário digitar o número
    }

    if (campoPais && !campoPais.value) {
      campoPais.value = "Brasil"
    }

    // Mostrar mensagem de sucesso
    mostrarMensagemCEP("✅ Endereço encontrado e preenchido automaticamente!", "success")
  } catch (error) {
    console.error("Erro ao buscar CEP:", error)

    // Limpar e habilitar os campos em caso de erro
    campos.forEach((campo) => {
      const elemento = document.querySelector(`input[name="${campo}"]`)
      if (elemento) {
        elemento.value = ""
        elemento.disabled = false
        elemento.style.backgroundColor = ""
      }
    })

    mostrarMensagemCEP("❌ CEP não encontrado. Preencha os campos manualmente.", "error")
  }
}

// Função para mostrar mensagens temporárias
function mostrarMensagemCEP(texto, tipo) {
  // Remover mensagem anterior se existir
  const mensagemAnterior = document.querySelector(".mensagem-cep")
  if (mensagemAnterior) {
    mensagemAnterior.remove()
  }

  // Criar nova mensagem
  const mensagem = document.createElement("div")
  mensagem.className = `mensagem-cep ${tipo}`
  mensagem.style.cssText = `
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        animation: fadeIn 0.3s ease-in;
        ${
          tipo === "success"
            ? "background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;"
            : "background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;"
        }
    `
  mensagem.textContent = texto

  // Inserir a mensagem após o campo CEP
  const campoCEP = document.querySelector('input[name="CEP"]')
  if (campoCEP && campoCEP.parentNode) {
    campoCEP.parentNode.insertBefore(mensagem, campoCEP.nextSibling)
  }

  // Remover a mensagem após 4 segundos
  setTimeout(() => {
    if (mensagem.parentNode) {
      mensagem.style.animation = "fadeOut 0.3s ease-out"
      setTimeout(() => {
        if (mensagem.parentNode) {
          mensagem.remove()
        }
      }, 300)
    }
  }, 4000)
}

// Adicionar CSS para animações
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    input:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`
document.head.appendChild(style)

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const campoCEP = document.querySelector('input[name="CEP"]')
  if (campoCEP) {
    // Adicionar placeholder mais descritivo
    campoCEP.placeholder = "Digite o CEP (ex: 12345-678)"

    // Formatação automática enquanto digita
    campoCEP.addEventListener("input", function () {
      formatarCEP(this)

      // Buscar automaticamente quando CEP estiver completo
      const cep = this.value.replace(/\D/g, "")
      if (cep.length === 8) {
        buscarEnderecoPorCEP(cep)
      }
    })

    // Buscar também quando sair do campo
    campoCEP.addEventListener("blur", function () {
      const cep = this.value.replace(/\D/g, "")
      if (cep.length === 8) {
        buscarEnderecoPorCEP(cep)
      }
    })
  }
})
