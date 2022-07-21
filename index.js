const express = require('express');
const fileUpload = require('express-fileupload'); // Precisa disso aqui pra conseguir puxar o arquivo via POST
const { Msg, groupsString } = require('./whats.js'); // Puxando o método de mandar mensagem lá do whats.js
const { UpdateDatabase } = require('./whats.js'); // Puxando o método de atualizar o array de IDs lá do whats.js
let { text } = require('./whats.js');
let { groups } = require('./whats.js');
let { groupsNames } = require('./whats.js');
const app = express(); // Nova instância do express.
const port = 3000;
let BuildPage = require('./groups.js'); // função que cria a página
let date = new Date();

app.use(fileUpload()); // Usando o pacote pra lidar com arquivos

// Isso aqui é o que abre quando voce digita localhost:3000
app.get('/', (req, res) =>  {
    // res.sendFile(__dirname + "/index.html"); // Retornando um HTML pra ficar mais facil de fazer o visual do front-end
    text = "FREE - INFORME CRIPTO - "+ date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear() +
    "\n\nAcompanhe nossos outros áudios em @InformeCriptoCanal"+
    "\n\nVocê quer que seu grupo ou canal fique bem informado com nossos áudios?"
    "\n\nBasta adicionar nosso Bot @InformeCripto_BOT como administrador e enviar uma mensagem para @DAYVISONH, assim liberaremos seu grupo/canal 100% grátis!"
    "\n\nLembre-se, informação é tudo!";
    res.send(BuildPage(text,groupsNames, groups));
})

// Tem que fazer isso pra poder usar o css no HTML
app.get('/style.css', (req, res)=>{
    res.sendFile(__dirname + "/style.css");
})

// Isso aqui é o que roda quando o usuário clica no botão Enviar.
app.post('/upload', (req, res) =>{
    // Daqui pra baixo  eu só copiei da documentação rsrsrs
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + sampleFile.name;
  
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
      
        // Daqui pra baixo fui eu
      res.send(BuildPage(text,groupsNames, groups)); // Depois que o código termina de pegar o arquivo, ele carrega de novo a página inicial.
      const encoded = req.files.sampleFile.data.toString('base64'); // Tem que codificar o arquivo pra conseguir mandar pelo zap.
      Msg(req.files.sampleFile.mimetype, encoded,req.body.text,req.body.group); // E aí finalmente dá pra chamar a função de mandar mensagem puxando os valores do HTML.
    });

    // console.log(req.body.group);
})

// Isso aqui é o que roda quando o usuário clica no botão de atualizar o banco de dados.
app.post('/update', (req,res)=>{
  UpdateDatabase();
  res.send(BuildPage(text,groupsNames, groups)); // Voltando pra página inicial, de novo.
})

// Eu não sei pq isso fica aqui no fim do código.
app.listen(port, () => {
    // console.clear();
    console.log(`Express rodando na porta ${port}`);
})

module.exports = process.myGlobals = app;