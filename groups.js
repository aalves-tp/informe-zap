function BuildPage(text, names, ids)
{
    let nameList="";
    for (let i = 0; i < names.length; i++) {
        nameList += 
        '<option value="'+ids[i]+'">'+names[i]+'</option>';
    }

    let page = "<!DOCTYPE html>\n"+
    "<html lang='en'>\n"+
    "<head>\n"+
    "    <meta charset='UTF-8'>\n"+
    "    <meta http-equiv='X-UA-Compatible' content='IE=edge'>\n"+
    "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n"+
    "    <link rel='stylesheet' href='style.css'>\n"+
    "    <title>Bot Informe Cripto</title>\n"+
    "</head>\n"+
    "<body>\n"+
    "    <form ref='uploadForm' \n"+
    "      id='uploadForm' \n"+
    "      action='http://localhost:3000/upload' \n"+
    "      method='post' \n"+
    "      encType='multipart/form-data'>\n"+
    "      <label>\n"+
    "        <input id='fileLoader' type='file' name='sampleFile' />\n"+
    "      </label>\n"+
    "        <textarea id='textBox' type='text' name='text'>\n"+
    text+
    "        </textarea>\n"+
    // names[0]+"<br>"+
    "<div>"+
    '<select name="group" multiple id=groupSelect>'+
        nameList+
    '</select>'+
    "</div>"+
    "        <input type='submit' value='Enviar' />\n"+
    "    </form>\n"+
    
    "    <form ref='UpdateDataBase' \n"+
    "    id='updateForm' \n"+
    "    action='/update' \n"+
    "    method='post'>\n"+
    "      <input type='submit' value='Update Database'/>\n"+
    "  </form>\n\n"+
    
    // "  <form action='/listGroups' method='post'>\n"+
    // "    <input type='submit' value='OK'>\n"+
    // "  </form>\n"+
    "</body>\n"+
    "</html>\n";

    return page;
}



module.exports = process.myGlobals = BuildPage;