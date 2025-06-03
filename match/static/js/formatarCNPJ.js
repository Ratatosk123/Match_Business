/**
 * Formata o CNPJ no formato XX.XXX.XXX/XXXX-XX
 * @param {string} CNPJ - O CNPJ a ser formatado
 * @returns {string} - O CNPJ formatado
 */
function formatarCNPJ(CNPJ) {
    // Remove todos os caracteres não numéricos
    let cnpjStr = CNPJ.replace(/\D/g, '');

    // Limita ao tamanho máximo de 14 dígitos
    cnpjStr = cnpjStr.substring(0, 14);

    // Aplica a formatação
    if (cnpjStr.length <= 2) {
        return cnpjStr;
    } else if (cnpjStr.length <= 5) {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2)}`;
    } else if (cnpjStr.length <= 8) {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2, 5)}.${cnpjStr.substring(5)}`;
    } else if (cnpjStr.length <= 12) {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2, 5)}.${cnpjStr.substring(5, 8)}/${cnpjStr.substring(8)}`;
    } else {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2, 5)}.${cnpjStr.substring(5, 8)}/${cnpjStr.substring(8, 12)}-${cnpjStr.substring(12)}`;
    }
}

/**
 * Aplica a formatação ao campo de texto enquanto o usuário digita
 * @param {HTMLInputElement} input - O campo de texto do CNPJ
 */
function aplicarFormatacaoCNPJ(input) {
    const valorFormatado = formatarCNPJ(input.value);
    input.value = valorFormatado;
}

// Adiciona o evento de input ao campo de CNPJ
document.addEventListener("DOMContentLoaded", function () {
    const campoCNPJ = document.querySelector('input[placeholder="Digite aqui o CNPJ da Empresa"]');
    if (campoCNPJ) {
        campoCNPJ.addEventListener("input", function () {
            aplicarFormatacaoCNPJ(campoCNPJ);
        });
    }
});

/**
 * Formata o CNPJ no formato XX.XXX.XXX/XXXX-XX
 * @param {string} CNPJ - O CNPJ a ser formatado
 * @returns {string} - O CNPJ formatado
 */
function formatarCNPJ(CNPJ) {
    // Remove todos os caracteres não numéricos
    let cnpjStr = CNPJ.replace(/\D/g, '');

    // Limita ao tamanho máximo de 14 dígitos
    cnpjStr = cnpjStr.substring(0, 14);

    // Aplica a formatação
    if (cnpjStr.length <= 2) {
        return cnpjStr;
    } else if (cnpjStr.length <= 5) {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2)}`;
    } else if (cnpjStr.length <= 8) {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2, 5)}.${cnpjStr.substring(5)}`;
    } else if (cnpjStr.length <= 12) {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2, 5)}.${cnpjStr.substring(5, 8)}/${cnpjStr.substring(8)}`;
    } else {
        return `${cnpjStr.substring(0, 2)}.${cnpjStr.substring(2, 5)}.${cnpjStr.substring(5, 8)}/${cnpjStr.substring(8, 12)}-${cnpjStr.substring(12)}`;
    }
}

/**
 * Aplica a formatação ao campo de texto enquanto o usuário digita
 * @param {HTMLInputElement} input - O campo de texto do CNPJ
 */
function aplicarFormatacaoCNPJ(input) {
    const valorFormatado = formatarCNPJ(input.value);
    input.value = valorFormatado;
}

// Adiciona o evento de input ao campo de CNPJ
document.addEventListener("DOMContentLoaded", function () {
    const camposCNPJ = document.querySelectorAll('input[placeholder="Digite aqui o CNPJ"]');
    camposCNPJ.forEach(function (campoCNPJ) {
        campoCNPJ.addEventListener("input", function () {
            aplicarFormatacaoCNPJ(campoCNPJ);
        });
    });
});