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
            console.log(resultados)
            res.send(JSON.stringify(resultados));            
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