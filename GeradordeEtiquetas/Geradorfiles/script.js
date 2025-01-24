const ETIdesc = document.getElementById("descDesc")
const ETInnf = document.getElementById("numNOTA")
const ETIncli = document.getElementById("nomeCliente")
const ETIcnpj = document.getElementById("CNPJJ")
const ETIquant = document.getElementById("quant")
const ETIcode = document.getElementById("codigo")

function enviarSolicitacao(numNF) {
    const url = "https://192.168.88.72:5000/NotaFiscal";
    const data = { numNF: numNF };
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            const numero_nf_dest = data.numero_nf_dest;
            const destinatario = data.destinatario;
            const produtos = data.produtos;

            // Mostra os dados no console (ou faça algo com eles)
            console.log("Número NF Dest:", numero_nf_dest);
            console.log("Destinatário:", destinatario);
            console.log("Produtos:", produtos);
            
            // Atualiza os elementos da etiqueta com os dados recebidos
            ETInnf.innerHTML = numero_nf_dest;
            ETIncli.innerHTML = destinatario.razao_social;
            ETIcnpj.innerHTML = `CNPJ: ${destinatario.cnpj_cpf}`;
            ETIdesc.innerHTML = produtos.map(produto => `${produto.xProd}`).join('<br>');
            ETIcode.innerHTML = produtos.map(produto => `${produto.cProd}`)
            ETIquant.innerHTML = produtos.map(produto => `QUANTIDADE: ${produto.qCom}`);
        } else {
            alert("Erro ao enviar sinal.");
        }
    })
    .catch(error => {
        alert(`Erro de Conexão. Erro: ${error}`);
        console.error("Erro:", error);
    });
}

document.getElementById('enviarButton').addEventListener('click', () => {
    const numNF = document.getElementById('valorInput').value;

    if (numNF) {
        enviarSolicitacao(numNF);
    } else {
        alert("Por favor, insira um número da nota.");
    }
});