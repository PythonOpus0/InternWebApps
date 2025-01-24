const ETIdesc = document.getElementById("descDesc");
const ETInnf = document.getElementById("numNOTA");
const ETIncli = document.getElementById("nomeCliente");
const ETIcnpj = document.getElementById("CNPJJ");
const ETIquant = document.getElementById("quant");
const ETIcode = document.getElementById("codigo");

        function criarEtiqueta(produto, numNF, destinatario, index) {
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
                        <td colspan="2" class="bold" id="inputVol-${index}">1/1</td>
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
                    <tr>
                        <td colspan="4">
                            <button class="download-btn" onclick="baixarEtiqueta(${index})">Baixar PDF</button>
                        </td>
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

                    // Mostra os dados no console (ou faça algo com eles)
                    console.log("Número NF Dest:", numero_nf_dest);
                    console.log("Destinatário:", destinatario);
                    console.log("Produtos:", produtos);

                    // Limpa as etiquetas antigas
                    const etiquetasDiv = document.getElementById("etiquetas");
                    etiquetasDiv.innerHTML = '';

                    // Cria uma nova etiqueta para cada produto
                    produtos.forEach((produto, index) => {
                        const etiquetaHTML = criarEtiqueta(produto, numero_nf_dest, destinatario, index);
                        etiquetasDiv.innerHTML += etiquetaHTML;
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao enviar a solicitação:', error);
            });
        }

        function baixarEtiqueta(index) {
            const etiquetaElement = document.getElementById(`etiqueta-${index}`);
            const etiquetaAltura = etiquetaElement.offsetHeight; 
            const alturaBotao = 52; 
            const opt = {
                margin: 0,
                filename: `etiqueta-${index}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'px', format: [(etiquetaAltura - alturaBotao), 290], orientation: 'p' }
            };
            html2pdf().from(etiquetaElement).set(opt).save();
        }
        

        function volumeMudar(volumes) {
            const etiquetas = document.querySelectorAll("[id^='etiqueta-']");
            etiquetas.forEach((etiqueta, index) => {
                const volElement = document.getElementById(`inputVol-${index}`);
                if (volElement) {
                    volElement.innerHTML = volumes;
                }
            });
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

        document.getElementById('buttonVol').addEventListener('click', () => {
            const volumes = document.getElementById('Inputtoo').value;
            if (volumes) {
                volumeMudar(volumes);
            } else {
                alert("Por favor, insira um valor em volumes.");
            }
        });