const http = require("http");
const fs = require("fs");
const path = require("path");
var querystring = require('querystring');
var nodemailer = require('nodemailer');

var servicio;
var correoEmisor;
var contrasena;
var correoDestnatario;
var asunto;
var texto;

http.createServer( (request, response) => {

  if (request.method == 'POST') {

    request.on('data', function (data) {
         var a = data.toString();
         var q = querystring.parse(a);

         servicio = q.servicio;
         correoEmisor = q.correo1;
         correoDestnatario = q.correo2;
         contrasena = q.contrasena;
         asunto = q.asunto;
         texto = q.text;
         enviarCorreo();
         
     });

  }

  var filePath = request.url;
  if (filePath == '/') { filePath = '/correo.html'; }

  filePath = __dirname+filePath;
  let fileExtension = path.extname(filePath);
  let contentType = 'text/html';

  switch (fileExtension) {
      case ".css":
          contentType = "text/css";
      break;
      case ".js":
          contentType = "text/javascript";
      break;
      case ".html":
          contentType = "text/html";
      default:
          contentType = "text/html";
  }

 fs.readFile(filePath,{encoding:"UTF-8"}, (error,content)=>{
     if(!error) {
         response.writeHead(200, {"Content-Type": contentType});
         response.write(content);
         response.end();
     } else {
         response.writeHead(404, {"Content-Type": "text/html"});
         response.write("error file");
         response.end();
     }
  })

}).listen(8080);
console.log("servidor funcionando");


function enviarCorreo(){

  var transporter = nodemailer.createTransport({
    service: servicio,
    auth: {
      user: correoEmisor,
      pass: contrasena
    }
  });

  var mailOptions = {
    from: correoEmisor,
    to: correoDestnatario,
    subject: asunto,
    text: texto
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });

}
