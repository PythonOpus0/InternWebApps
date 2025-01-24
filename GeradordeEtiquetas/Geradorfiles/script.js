
        const ETIdesc = document.getElementById("descDesc");
        const ETInnf = document.getElementById("numNOTA");
        const ETIncli = document.getElementById("nomeCliente");
        const ETIcnpj = document.getElementById("CNPJJ");
        const ETIquant = document.getElementById("quant");
        const ETIcode = document.getElementById("codigo");

        function criarEtiqueta(produto, numNF, destinatario, index, totalProdutos) {
            return `
                <table class="etiqueta" id="etiqueta-${index}">
                    <tr>
                        <th colspan="4" class="header">CONFERÊNCIA - EXPEDIÇÃO</th>
                    </tr>
                    <tr>
                        <td colspan="3" class="delivery-section">
                            <div style="display: flex; text-align: center; justify-content: center; line-height: 50px">
                                <span>ENTREGA</span>
                            </div>
                        </td>
                        <td class="logo">
                            <img src="image.png" alt="Logo Opus">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="bold">NOTA FISCAL N°:</td>
                        <td colspan="2" class="bold" id="numNOTA">${numNF}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="bold">VOLUMES:</td>
                        <td colspan="2" class="bold" id="inputVol-${index}">${index + 1}/${totalProdutos}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">OPUS MEDICAL E ELETRONICS LTDA</td>
                    </tr>
                    <tr>
                        <td colspan="4">CNPJ: 14.368.486/0001-20</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">CLIENTE/FORNECEDOR:</td>
                    </tr>
                    <tr>
                        <td colspan="4" id="nomeCliente">${destinatario.razao_social}</td>
                    </tr>
                    <tr>
                        <td colspan="4" id="CNPJJ">CNPJ: ${destinatario.cnpj_cpf}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">
                            DESCRIÇÃO:
                            <br>
                            <span class="normal" id="descDesc">${produto.xProd}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">
                            CÓDIGO:
                            <br>
                            <span class="normal" id="codigo">${produto.cProd}</span>
                        </td>
                    </tr>        
                    <tr>
                        <td colspan="4" class="bold" id="quant">QUANTIDADE: ${produto.qCom}</td>
                    </tr>
                </table>
            `;
        }

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
                    const totalProdutos = produtos.length;

                    // Mostra os dados no console (ou faça algo com eles)
                    console.log("Número NF Dest:", numero_nf_dest);
                    console.log("Destinatário:", destinatario);
                    console.log("Produtos:", produtos);

                    // Limpa as etiquetas antigas
                    const etiquetasDiv = document.getElementById("etiquetas");
                    etiquetasDiv.innerHTML = '';

                    // Limpa os botões antigos
                    const downloadButtonsDiv = document.getElementById("downloadButtons");
                    downloadButtonsDiv.innerHTML = '';

                    // Cria uma nova etiqueta para cada produto
                    produtos.forEach((produto, index) => {
                        const etiquetaHTML = criarEtiqueta(produto, numero_nf_dest, destinatario, index, totalProdutos);
                        etiquetasDiv.innerHTML += etiquetaHTML;

                        // Cria um botão "Baixar PDF" para cada etiqueta
                        const buttonHTML = `<div class="btn btn-three" onclick="baixarEtiqueta(${index})"><span>Baixar PDF ${index + 1}</span></div>`;
                        downloadButtonsDiv.innerHTML += buttonHTML;
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao enviar a solicitação:', error);
            });
        }

        function baixarEtiqueta(index) {
            const etiquetaElement = document.getElementById(`etiqueta-${index}`);
            const etiquetaAltura = etiquetaElement.offsetHeight; // Calcula a altura da etiqueta
            const olha2px = 2;
            const opt = {
                margin: 0,
                filename: `etiqueta-${index}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'px', format: [(etiquetaAltura + olha2px), 290], orientation: 'p' } // Ajusta a altura do PDF
            };
            html2pdf().from(etiquetaElement).set(opt).save();
        }

        // Adiciona eventos aos botões
        document.getElementById('enviarButton').addEventListener('click', () => {
            const numNF = document.getElementById('valorInput').value;
            if (numNF) {
                enviarSolicitacao(numNF);
            } else {
                alert("Por favor, insira um número da nota.");
            }
        });
        document.getElementById('baixarTodasButton').addEventListener('click', () => {
            const totalProdutos = document.querySelectorAll('.etiqueta').length; // Obtém o número total de etiquetas
            for (let i = 0; i < totalProdutos; i++) {
                baixarEtiqueta(i);
            }
        });
        