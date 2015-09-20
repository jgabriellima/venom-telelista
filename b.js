var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var queryString = require('query-string');
var fs = require('fs');


function walk(currentDirPath, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walk(filePath, callback);
        }
    });
}


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
var u = "http://www.telelistas.net/pa/belem/arquitetos?pagina=1";
var limit = 3;
// var u = "http://www.telelistas.net/templates/envia.aspx?tipo=anuncioemail&email_dest=dipiscina@oi.com.br&nome_dest=Di%20Piscina%20-%20Mangueir%e3o&logvc=3&id=300733683";
// var u = 'http://www.telelistas.net/templates/logredirect.aspx?idcliente=11619186&tpmat=IG&ct=3760506&mt=2&uf=pa&id=300740001&cidade=91000&bairro=0&titulo=5703&acao=email&link=%2ftemplates%2fenvia.aspx%3ftipo%3danuncioemail%26email_dest%3disoeng%40isoeng.eng.br%26nome_dest%3dIsoeng+-+Engenharia+e+Gest%e3o+%26logvc%3d3%26id%3d300740001';
// var parsed = queryString.parse(unescape(u));
// console.log(parsed);
// for (var i = 1; i <= limit; i++) {
/*findArquitetos(u, function(result) {
    console.log(result);
});*/
var all = [];
walk('pages', function(filePath, stat) {
    // do something with "filePath"...
    fs.readFile(filePath, 'utf8', function(err, contents) {
        $ = cheerio.load(contents, {
            normalizeWhitespace: true
        });
        $('td.text_resultado_ib').each(function() {
            $(this).parent().parent().find('td.ib_ser a').each(function() {
                console.log($(this).text(),$(this).attr("href"));
                var hasEmail = ($(this).text() === "e-mail");
                if (hasEmail) {
                    var prev = "window.open('";
                    var next = "', 'Enviar', 'scrollbars=no,width=360,height=605,resizeable=yes');return false;";
                    var text_url = $(this).attr("onclick").replace(prev,"").replace(next,""); 
                    var obj = queryString.parse(unescape(text_url));
                    all.push({empresa:obj.nome_dest,email:obj.email_dest});
                }
            });
        });
    });
});
console.log(all);
// }
/*
erro_class="tit_erro"
*/
function findArquitetos(url, callback) {
    var h = {
        'Host': 'www.telelistas.net',
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:40.0) Gecko/20100101 Firefox/40.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie': 'auto=automatico=0; perfil=logged=0&iduser=0&email=&usertype=1&specialsearch=0&siteusernome=&siteuserdatanasc=&siteusersexo=&siteuserlocalidade=91000&siteuseruf=PA&siteuserddd=&siteusertelefone=&siteuserprofissao=&siteuserrenda=&siteuserformacao=&siteusernovidades=&siteusernovidadesrevista=&siteusernovidadesparceiros=&siteusercpf=&siteuseracesso=&siteusercep=&siteuseridade=0&siteuserparceiro=telelistas&siteuserconhecimento=&siteuseroperadora=&siteuserurlorigem=&siteuserdatacadastro=; _ga=GA1.2.648646317.1442675449; cto_rta=; searchparameters=btnsite=0&codlocalidade=91000&localidadeendmap=&email=&origem=0&letra=&codbairro=0&localidade=&manobrista=0&codtitulo=5703&pcount=25&comib=0&pgresultado=&btnemail=0&info=&top=&cartoes=0&site=&estacionamento=0&predio=0&entrega=0&chave=&atividade=arquitetos&ddd=0&bairro=&reserva=0&comercial=0&codlogradouro=&residencial=0&nome=&pagina=1&tiquete=0&telefone=&bottom=0&uf=pa&pchave=&zoom=&logradouro=; __gads=ID=d66ef041f3cff1cb:T=1442675476:S=ALNI_Mb9wqbTDNZ5IKOUH1xyYaLYIkS4Jw; __utma=38844454.4699808.1442675549.1442675549.1442675549.1; __utmc=38844454; __utmz=38844454.1442675549.1.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); schave=CB06',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0'
    }

    request.get({
        url: url,
        jar: true,
        header: h
    }, function(err, httpResponse, body) {
        console.log(httpResponse);
        var obj = {};
        $ = cheerio.load(body, {
            normalizeWhitespace: true
        });
        // console.log(body);
        console.log('a :', $('a').length);

        var wstream = require('fs').createWriteStream('myOutput.txt');
        wstream.write(body);
        wstream.end();


        // console.log($("#ctl00_Content_Regs").text());
        // console.log($("#ctl00_Content_Regs td.ib_ser[align=left]").length);

        // $("td.ib_ser[align=left]").each(function() {
        //     console.log($(this).text());
        // });
        // console.log(body);
        // var erro = $(".tit_erro").text();
        // console.log(body);
        callback(obj);
    });
};
