const mysql = require('mysql2');

// Configurações de conexão
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuário do MySQL
    password: '1234', // Senha do MySQL
    database: 'univali' // Nome no banco
});

// Conexão ao banco de dados
conn.connect((erro) => {
    if (erro){
        console.error('Erro ao conectar ao MySQL:', erro);
        throw erro;
    };
    console.log("Conectado ao MySQL com sucesso!");
    let sql = ` CREATE TABLE IF NOT EXISTS imovel
                (
                    id_imovel int not null auto_increment primary key
                    , descricao_imovel varchar(150)
                    , tipo_imovel varchar(30)
                );`;
    conn.execute(sql, (erro, retorno) => {
        if (erro) {
            console.error('Erro ao criar a tabela de Imóvel:', erro);
            throw erro;
        } else if (retorno.warningStatus === 0) {
            console.log('Criado tabela de Imóvel');
            sql = `INSERT INTO imovel 
                (descricao_imovel, tipo_imovel) 
                VALUES 
                ('Apartamento no Centro', 'Apartamento'),
                ('Casa na Praia', 'Casa'),
                ('Cobertura de Luxo', 'Cobertura'),
                ('Chácara no Interior', 'Chácara'),
                ('Studio Moderno', 'Studio'),
                ('Apartamento Compacto', 'Apartamento'),
                ('Casa com Piscina', 'Casa'),
                ('Cobertura Duplex', 'Cobertura'),
                ('Terreno Urbano', 'Terreno'),
                ('Loft Industrial', 'Loft');`;
            
            conn.execute(sql, (erro, retorno) =>{
                if (erro){
                    console.error('Erro ao inserir dados na tabela de Imóvel:', erro);
                    throw erro;
                }
                console.log("Inserido dados na tabela de Imóvel");
            });
        };
    });

    sql = `CREATE TABLE IF NOT EXISTS venda
            (
            id_venda int not null auto_increment primary key
            , data_do_pagamento date not null
            , valor_do_pagamento float not null
            , id_imovel int not null
            , FOREIGN KEY (id_imovel) REFERENCES imovel(id_imovel)
            );`;

    conn.execute(sql, (erro, retorno) => {
        if (erro){
            console.error("Erro ao criar a tabela de venda:", erro);
        } else if (retorno.warningStatus === 0) {
            console.log("Criado tabela de venda");
            sql = `INSERT INTO venda 
                    (data_do_pagamento, valor_do_pagamento, id_imovel) 
                    VALUES 
                    ('2024-01-10', 150000.00, 1),
                    ('2024-01-15', 200000.00, 2),
                    ('2024-01-20', 250000.00, 3),
                    ('2024-02-05', 175000.00, 4),
                    ('2024-02-10', 300000.00, 5),
                    ('2024-02-15', 220000.00, 6),
                    ('2024-03-10', 190000.00, 7),
                    ('2024-03-15', 210000.00, 8),
                    ('2024-03-20', 160000.00, 9),
                    ('2024-04-05', 230000.00, 10),
                    ('2024-01-11', 150000.00, 1),
                    ('2024-01-16', 200000.00, 2),
                    ('2024-01-21', 250000.00, 3),
                    ('2024-02-06', 175000.00, 4),
                    ('2024-02-11', 300000.00, 5),
                    ('2024-02-16', 220000.00, 6),
                    ('2024-03-11', 190000.00, 7),
                    ('2024-03-16', 210000.00, 8),
                    ('2024-03-21', 160000.00, 9),
                    ('2024-04-06', 230000.00, 10),
                    ('2024-05-05', 250000.00, 3),
                    ('2024-05-10', 175000.00, 4),
                    ('2024-05-15', 300000.00, 5),
                    ('2024-05-20', 220000.00, 6),
                    ('2024-06-05', 190000.00, 7),
                    ('2024-06-10', 210000.00, 8),
                    ('2024-06-15', 160000.00, 9),
                    ('2024-06-20', 230000.00, 10),
                    ('2024-07-05', 190000.00, 7),
                    ('2024-07-10', 210000.00, 8),
                    ('2024-07-15', 160000.00, 9),
                    ('2024-07-20', 230000.00, 10),
                    ('2024-08-05', 210000.00, 8),
                    ('2024-08-10', 160000.00, 9),
                    ('2024-08-15', 230000.00, 10);`;

            conn.execute(sql, (erro, retorno) => {
                if (erro) {
                    console.log("Erro ao inserir dados na tabela de Vendas:", erro);
                    throw erro;
                } 
                console.log("Inserido dados na tabela de Vendas");
            });
        };
    });

});

// Exportar a conexão para outros arquivos
module.exports = conn;