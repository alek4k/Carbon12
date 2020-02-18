var http = require('http');
var fs = require('fs');
var formidable = require('formidable');

// html file containing upload form
var upload_html = fs.readFileSync("addestramento.html");
var download_html = fs.readFileSync("downloadPredittore.html");

// replace this with the location to save uploaded files
var upload_path = __dirname + '/';

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // oldpath : temporary folder to which file is saved to
            var oldpath = files.filetoupload.path;
            var newpath = upload_path + files.filetoupload.name;
            // copy the file to a new location
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;

                //AGGIUNGERE CONTROLLO FILE: al posto di throw err visualizzare messaggio errore
                //Controllo ok: Deve richiamare la funziona della libreria che fa ADDESTRAMENTO
                //quando il file è pronto deve tornare alla pagina per il download

                // you may respond with another html page
                res.write(download_html);
                res.end();
            });
        });
    }
    else{
      res.writeHead(200);
      res.write(upload_html);
      return res.end();
    }
}).listen(8080);
