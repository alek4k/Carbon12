var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var mime = require('mime');

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
                res.writeHead(301,{'Location' : 'downloadPredittore'});
                return res.end();
            });
        });
    }
    else if(req.url == '/downloadPredittore'){
      res.write(download_html);
      return res.end();
    }
    else if(req.url == '/downloadFile'){
      var file = __dirname + '/predittore.json';

      var filename = path.basename(file);
      var mimetype = mime.lookup(file);

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
      //return res.end();
    }
    else{
      res.writeHead(200);
      res.write(upload_html);
      return res.end();
    }
}).listen(8080);
