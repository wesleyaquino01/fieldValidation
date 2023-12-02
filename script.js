let cpf_input = document.getElementById("input-cpf");
let email_input = document.getElementById("input-email");
let cnpj_input = document.getElementById("input-cnpj");
let telefone_input = document.getElementById("input-telefone");

let cep_input = document.getElementById("input-cep");
let logradouro_input = document.getElementById("input-logradouro");
let complemento_input = document.getElementById("input-complemento");
let bairro_input = document.getElementById("input-bairro");
let localidade_input = document.getElementById("input-localidade");
let uf_input = document.getElementById("input-uf");


const formulario = document.getElementById("formulario").addEventListener('submit', (event) => {
    event.preventDefault();


    let cpf_formatado = mascaraCpf(cpf_input.value);
    let cep_input_value = cep_input.value;

    if (cep_input_value.length === 8) {
        dados_api(cep_input_value);
    } else {
        alert('CEP inválido. Certifique-se de inserir 8 dígitos.');
    }

    console.log(cpf_formatado, email_input.value, cnpj_input.value, telefone_input.value, cep_input_value, logradouro_input.value, complemento_input.value, bairro_input.value, localidade_input.value, uf_input.value);

    validar_cpf(cpf_input.value);
})


document.getElementById('input-cpf').addEventListener('input', function () {
    this.value = mascaraCpf(this.value);
});

document.getElementById('input-cnpj').addEventListener('input', function () {
    this.value = mascaraCpf(this.value);
});

cep_input.addEventListener('blur', () => {
    let cep_input_value = cep_input.value;
    if (cep_input_value.trim() !== "") {
        dados_api(cep_input_value);
    }
});



// function validar_cpf(cpf_valor) {
//     // 11 digitos
//     // formato da mask  000.000.000-00
//     // ([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})
//     if (cpf_valor.length >= 11) {
//         console.log('CPF Válido!')
//     } else {
//         console.log('CPF Inválido!')
//     }
// }

function validar_cpf(cpf_valor) {
    // Remover caracteres não numéricos do CPF
    const cpf = cpf_valor.replace(/\D/g, '');

    // Verificar se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
        console.log('CPF Inválido! O CPF deve ter 11 dígitos.');
        return false;
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        console.log('CPF Inválido! Todos os dígitos são iguais.');
        return false;
    }

    // Calcular o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto >= 10 ? 0 : resto;

    // Calcular o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto >= 10 ? 0 : resto;

    // Verificar se os dígitos verificadores calculados são iguais aos fornecidos no CPF
    if (parseInt(cpf.charAt(9)) !== digitoVerificador1 || parseInt(cpf.charAt(10)) !== digitoVerificador2) {
        console.log('CPF Inválido! Dígitos verificadores incorretos.');
        return false;
    }

    console.log('CPF Válido!');
    return true;
}


function mascaraCpf(v) {
    v = v.replace(/\D/g, "")                    //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
    return v
}

function mascaraCnpj(v) {
    v = v.replace(/\D/g, "")                           //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, "$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
    return v
}

function validar_email() {
    /**
     * gmail
     * outlook
     * yahoo
     * hotmail
     */
}


function dados_api(cep) {
    // const cep = input.value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            'content-type': 'application/json;charset=utf-8',
        }
    }

    fetch(url, options).then(
        response => response.json()
    ).then(
        data => {
            console.log(data);
            logradouro_input.value = data.logradouro;
            complemento_input.value = data.complemento;
            bairro_input.value = data.bairro;
            localidade_input.value = data.localidade;
            uf_input.value = data.uf;
        }
    ).catch(error => {
        console.log('Erro ao buscar dados:', error);
    });
}