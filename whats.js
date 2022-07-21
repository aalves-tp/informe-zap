const qrcode = require('qrcode-terminal'); // Pacote que desenha o QR Code no terminal.
const { Client } = require('whatsapp-web.js'); // Objeto que gerencia o ZAP.
const { MessageMedia } = require('whatsapp-web.js'); // Objeto que cria mensagens com media.
var fs = require('fs'); // Pacote pra lidar com arquivos.
const { group } = require('console');
const e = require('express');
const client = new Client(); // Instancia do ZAP.
let groups = []; // Array com os IDs dos grupos.
let groupsNames = []; // Array com os nomes dos grupos
let groupsString; // IDs dos grupos convertidas em string pro CSV.
let date = new Date();
let text; // variavel do texto que vai pro corpo da mensagem


// Bot gerando o QR
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Quando o bot termina de inicializar
client.on('ready', () => {
    console.log('Whatsapp autenticado');
    UpdateDatabase(); // Função que atualiza a lista de IDs de grupos
    text = "FREE - INFORME CRIPTO - " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() +
        "\n\nAcompanhe nossos outros áudios em @InformeCriptoCanal" +
        "\n\nVocê quer que seu grupo ou canal fique bem informado com nossos áudios?"
    "\n\nBasta adicionar nosso Bot @InformeCripto_BOT como administrador e enviar uma mensagem para @DAYVISONH, assim liberaremos seu grupo/canal 100% grátis!"
    "\n\nLembre-se, informação é tudo!";
});

// É nessa função que vai qualquer código relacionado ao banco de dados que a gente vá colocar.
function UpdateDatabase() {
    // Função que retorna todos os chats ativos no whats, em forma de Promise.
    client.getChats()
        .then((chats) => { // Resolvendo a Promise...
            for (const c of chats) // Pegando cada elemento do array que a promise resolvida gera.
            {
                if (c.isGroup) // Separando grupos dos chats normais
                {
                    // Se o grupo é read only, significa que o bot não tá mais no grupo.
                    // Então se nao for read only, salva os grupos e nomes.
                    // Se for read only, tira da lista.
                    // Por algum motivo, na primeira vez que roda o bot todos os grupos vem com read only UNDEFINED. Provavelmente pq o whatsapp é uma bosta. Mas isso não é um problema porque isso só acontece na primeira vez que o bot roda e depois disso ele vai ficar rodando pra sempre lá na heroku.
                    if (c.isReadOnly == false) {
                        if (!groups.includes(c.groupMetadata.id._serialized)) {
                            groups.push(c.groupMetadata.id._serialized); // Adicionando novos IDs
                            groupsNames.push(c.name); //    Adicionando novos Nomes
                        }
                    } else if (c.isReadOnly == undefined) {
                        if (!groups.includes(c.groupMetadata.id._serialized)) {
                            groups.push(c.groupMetadata.id._serialized); // Adicionando novos IDs
                            groupsNames.push(c.name); //    Adicionando novos Nomes
                        }
                    } else {
                        if (groups.includes(c.groupMetadata.id._serialized)) {
                            groups.splice(groups.indexOf(c.groupMetadata.id._serialized), 1); // Removendo novos IDs
                            groupsNames.splice(groupsNames.indexOf(c.name), 1); //    Removendo novos Nomes
                        }
                    }
                }
            }
        })
        .then(() => { // Dá pra resolver promises infinitamente.
            groupsString = groups.toString(); // Transformando o array com os IDs em string. O mais legal disso aqui é que ele ja fica separado por vírgula, aí é só botar no csv.

            // Salvando o csv.
            fs.writeFile(__dirname + '/groups.csv', groupsString, function (err) {
                if (err) throw err;
                console.log('Arquivo CSV atualizado.');
            });
        })
        .then(() => {
            const app = require('./index.js')
        })
}

// Função que manda mensagem. Recebe o tipo de arquivo, o arquvo em si e o texto da mensagem do index.js
function Msg(mimeType, data, text, selectedGroups) {
    let media = new MessageMedia(mimeType, data, 'informeFile'); // Criando uma instancia da mensagem com mídia.

    if (Array.isArray(selectedGroups)) {
        // Mandando mensagem pra todos os grupos do array.
        for (let i = 0; i < selectedGroups.length; i++) {
            client.sendMessage(selectedGroups[i], text);
            client.sendMessage(selectedGroups[i], media);
        }
    } else {
        client.sendMessage(selectedGroups, text);
        client.sendMessage(selectedGroups, media);
    }
}

client.initialize(); // Eu não sei pq isso fica aqui no fim do código.

module.exports = process.myGlobals = { Msg, UpdateDatabase, groupsString, text, groups, groupsNames } // Exportando a função de mandar mensagem e a de atualizar o array de IDs pra usar no index.js