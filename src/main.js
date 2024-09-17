const express = require('express'); // Importa o módulo express
const bodyParser = require('body-parser'); // Importa o módulo body-parser

const app = express();
const PORT = 3000;

const path = require('path'); // Importa o módulo path

const urlendodedParser = bodyParser.urlencoded({ extended: false });

const conn = require('./db');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina.html'));
});

app.get('/obtemImovelVenda', (req, res) => {
    let sql = ` SELECT 
                    venda.id_venda as idVenda,
                    DATE_FORMAT(venda.data_do_pagamento, '%d/%m/%Y') as dataPagamento,
                    FORMAT(venda.valor_do_pagamento, 2, 'de_DE') as valorPagamento,
                    imovel.id_imovel as idImovel,
                    imovel.descricao_imovel as descricaoImovel,
                    imovel.tipo_imovel as tipoImovel
                FROM venda
                    LEFT JOIN imovel on imovel.ID_IMOVEL = venda.ID_IMOVEL`
    
    conn.query(sql, (erro, resultados) => {
        if (erro) {
            res.status(500);
            res.send(JSON.stringify(erro));
            console.log(erro);
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            addCorsHttpHeaders(res);
            console.log(resultados);
            res.send(JSON.stringify(resultados));
        }
    })

});

app.get('/obtemVendaPorImovel', (req, res) => {
    let sql = ` SELECT 
                    venda.id_venda as idVenda,
                    DATE_FORMAT(venda.data_do_pagamento, '%d/%m/%Y') as dataPagamento,
                    venda.valor_do_pagamento as valorPagamento,
                    imovel.id_imovel as idImovel,
                    imovel.descricao_imovel as descricaoImovel,
                    imovel.tipo_imovel as tipoImovel
                FROM venda
                    LEFT JOIN imovel on imovel.ID_IMOVEL = venda.ID_IMOVEL`
    
    conn.query(sql, (erro, resultados) => {
        if (erro) {
            res.status(500);
            res.send(JSON.stringify(erro));
            console.log(erro);
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            addCorsHttpHeaders(res);
            const somaPagamentos = resultados.reduce((acc, pagamento) => {

                if (!acc[pagamento.idImovel]) {
                    acc[pagamento.idImovel] = 0; // Inicializa
                }

                acc[pagamento.idImovel] += pagamento.valorPagamento; // Soma
                return acc
            }, {});
            console.log(somaPagamentos);
            res.send(JSON.stringify(somaPagamentos));
        }
    })

});

app.get('/obtemVendaPorData', (req, res) => {
    let sql = ` SELECT 
                    venda.id_venda as idVenda,
                    DATE_FORMAT(venda.data_do_pagamento, '%m/%Y') as dataPagamento,
                    venda.valor_do_pagamento as valorPagamento,
                    imovel.id_imovel as idImovel,
                    imovel.descricao_imovel as descricaoImovel,
                    imovel.tipo_imovel as tipoImovel
                FROM venda
                    LEFT JOIN imovel on imovel.ID_IMOVEL = venda.ID_IMOVEL`
    
    conn.query(sql, (erro, resultados) => {
        if (erro) {
            res.status(500);
            res.send(JSON.stringify(erro));
            console.log(erro);
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            addCorsHttpHeaders(res);
            const somaPagamentos = resultados.reduce((acc, pagamento) => {

                if (!acc[pagamento.dataPagamento]) {
                    acc[pagamento.dataPagamento] = 0; // Inicializa
                }

                acc[pagamento.dataPagamento] +=pagamento.valorPagamento; // Soma
                return acc
            }, {});
            console.log(somaPagamentos);
            res.send(JSON.stringify(somaPagamentos));
        }
    })

});

app.get('/obtemVendaQuantitativa', (req, res) => {
    let sql = ` SELECT 
                    venda.id_venda as idVenda,
                    DATE_FORMAT(venda.data_do_pagamento, '%m/%Y') as dataPagamento,
                    venda.valor_do_pagamento as valorPagamento,
                    imovel.id_imovel as idImovel,
                    imovel.descricao_imovel as descricaoImovel,
                    imovel.tipo_imovel as tipoImovel
                FROM venda
                    LEFT JOIN imovel on imovel.ID_IMOVEL = venda.ID_IMOVEL`
    
    conn.query(sql, (erro, resultados) => {
        if (erro) {
            res.status(500);
            res.send(JSON.stringify(erro));
            console.log(erro);
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            addCorsHttpHeaders(res);
            const pagamentosTotais = resultados.reduce((acc, pagamento) => {
                if(!acc){
                    acc = 0;
                }
                acc += pagamento.valorPagamento
                return acc;
            }, 0);
            const imoveisVendaQuantitativa = resultados.reduce((acc, pagamento) => {
                if(!acc[pagamento.descricaoImovel]){
                    acc[pagamento.descricaoImovel] = 0;
                }
                acc[pagamento.descricaoImovel] += pagamento.valorPagamento;
                return acc;

            }, {});
            const imoveisVendaPorcentagem = Object.keys(imoveisVendaQuantitativa).reduce((acc, tipo) => {
                const valor = imoveisVendaQuantitativa[tipo];
                const percentual = ((valor / pagamentosTotais) * 100).toFixed(2) + '%';
                acc[tipo] = percentual;
                return acc;
            }, {});

            console.log(imoveisVendaPorcentagem);
            res.send(JSON.stringify(imoveisVendaPorcentagem));
        }
    })

});

app.listen(PORT, () => {
    console.log(`App online na porta ${PORT}\n\n------------------------------\nAcesse http://localhost:${PORT}/\n------------------------------\n`);
});

console.log("Node express está funcionando!");

function addCorsHttpHeaders(httpResponse){
    httpResponse.setHeader("Access-Control-Allow-Origin", "*");
    httpResponse.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
    httpResponse.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
    httpResponse.setHeader("Access-Control-Max-Age","1728000");
  }