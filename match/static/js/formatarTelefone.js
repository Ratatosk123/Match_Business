/**
 * Formata o número de telefone no formato (XX) XXXXX-XXXX
 * @param {string} numero - O número de telefone a ser formatado
 * @returns {string} - O número formatado
 */
function formatarTelefone(numero) {
    // Remove todos os caracteres não numéricos
    let numeroStr = numero.replace(/\D/g, '');

    // Limita ao tamanho máximo de 11 dígitos (DDD + número)
    numeroStr = numeroStr.substring(0, 11);

    // Aplica a formatação
    if (numeroStr.length <= 2) {
        return `(${numeroStr}`;
    } else if (numeroStr.length <= 7) {
        return `(${numeroStr.substring(0, 2)}) ${numeroStr.substring(2)}`;
    } else {
        return `(${numeroStr.substring(0, 2)}) ${numeroStr.substring(2, 7)}-${numeroStr.substring(7)}`;
    }
}

/**
 * Aplica a formatação ao campo de texto enquanto o usuário digita
 * @param {HTMLInputElement} input - O campo de texto do telefone
 */
function aplicarFormatacaoTelefone(input) {
    const valorFormatado = formatarTelefone(input.value);
    input.value = valorFormatado;
}

// Adiciona o evento de input ao campo de telefone
document.addEventListener("DOMContentLoaded", function () {
    const campoTelefone = document.querySelector('input[placeholder="Digite aqui o Telefone Empresarial"]');
    if (campoTelefone) {
        campoTelefone.addEventListener("input", function () {
            aplicarFormatacaoTelefone(campoTelefone);
        });
    }
});