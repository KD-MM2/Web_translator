var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var glob = require( 'glob' );
var language_dict = {};

glob.sync( './lang/*.json' ).forEach( function( file ) {
  let dash = file.split("/");
  if(dash.length == 3) {
      let dot = dash[2].split(".");
    if(dot.length == 2) {
      let lang = dot[0];
      fs.readFile(file, function(err, data) {
        language_dict[lang] = JSON.parse(data.toString());
      });
    }
  }
});

http.createServer(function (request, response) {
    console.log('request ', request.url);

    var q = url.parse(request.url, true);
    var lang = 'en';
    let dash = q.pathname.split("/");
    if(dash.length >= 2) {
    let code = dash[1];
    if(code !== '' && language_dict.hasOwnProperty(code)) {
      lang = code;
    }
  }

    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }



    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.woff2': 'application/font-woff2',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
            if(contentType == 'text/html'){
                let data_string = content.toString()
                for (var key of Object.keys(language_dict[lang])) {
                    let pattern = new RegExp("{{" + key + "}}", "g");
                    data_string = data_string.replace(pattern, language_dict[lang][key]);
                }
                response.write(data_string);
                response.end();
            } else {
                response.end(content);
            }
        }
    });

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');
