// Função para consultar o estoque
function consultarEstoque() {
    const resultadoDiv = document.getElementById("res");
    const url = 'https://192.168.88.72:5000/LerEst'; // Endpoint da API

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Erro na resposta da API');
            return response.json();
        })
        .then(data => {
            resultadoDiv.innerHTML = '<h2>Resultado da Consulta</h2>';

            if (data.length > 0) {
                // Campo de busca com datalist
                const input = document.createElement("input");
                input.type = "text";
                input.id = "itemSearch";
                input.setAttribute("list", "itemsList");
                input.placeholder = "Digite o nome ou código do item";

                const dataList = document.createElement("datalist");
                dataList.id = "itemsList";

                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = `${item.cDescricao} | ${item.cCodigo}`;
                    option.setAttribute("data-saldo", item.nSaldo);
                    dataList.appendChild(option);
                });

                // Exibição do saldo
                const saldoDisplay = document.createElement("p");
                saldoDisplay.id = "saldoDisplay";
                saldoDisplay.innerHTML = "Saldo do item selecionado: ";

                resultadoDiv.appendChild(input);
                resultadoDiv.appendChild(dataList);
                resultadoDiv.appendChild(saldoDisplay);

                input.addEventListener("input", () => {
                    const selectedItem = input.value;
                    const option = Array.from(dataList.options).find(opt => opt.value === selectedItem);

                    if (option) {
                        saldoDisplay.innerHTML = `Saldo do item selecionado: ${option.getAttribute("data-saldo")}`;
                    } else {
                        saldoDisplay.innerHTML = "Item inválido.";
                    }
                    verificarCampos();
                });
            } else {
                resultadoDiv.innerHTML += '<p>Nenhum produto encontrado no estoque.</p>';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            resultadoDiv.innerHTML = '<p>Erro ao consultar o estoque.</p>';
        });
}

// Verificar campos antes de exibir o botão
function verificarCampos() {
    const input = document.getElementById("itemSearch").value;
    const solicitante = document.getElementById("Solicitante").value.trim();
    const motivoOS = document.getElementById("MotivoOS").value.trim();
    const quantidadeNum = document.getElementById("quantNum").value.trim();
    const data = document.getElementById("Data").value;
    const saldoDisplay = document.getElementById("saldoDisplay").innerText;
    const sendButton = document.getElementById("sendButton");

    if (input && solicitante && motivoOS && quantidadeNum && data && saldoDisplay.includes("Saldo do item selecionado")) {
        sendButton.style.display = "block";
        sendButton.addEventListener("click", () => {
            const ht_mail = `
                <p><b>Item selecionado:</b> ${input}</p>
                <p><b>Saldo:</b> ${saldoDisplay.split(": ")[1]}</p>
                <p><b>Quantidade:</b> ${quantidadeNum}</p>
                <p><b>Solicitante:</b> ${solicitante}</p>
                <p><b>Motivo ou OS:</b> ${motivoOS}</p>
                <p><b>Data:</b> ${data}</p>
            `;
            enviarDados(ht_mail);
        });
    } else {
        sendButton.style.display = "none";
    }
}

// Função para enviar os dados
function enviarDados(ht_mail) {
    const url = 'https://192.168.88.72:5000/sendmail';

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ht_mail }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao enviar os dados');
            return response.json();
        })
        .then(() => {
            window.location.href = "/index"
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Erro ao enviar os dados.");
        });
}

// Adicionar eventos aos campos
document.querySelectorAll("#Solicitante, #MotivoOS, #quantNum, #Data").forEach(field => {
    field.addEventListener("input", verificarCampos);
});
