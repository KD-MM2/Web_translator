// https://developer.mozilla.org/ja/docs/Learn/Server-side/Node_server_without_framework
var fs = require('fs');
var http = require('http');
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

http.createServer(function (req, res) {
  console.log('request ', req.url);
  var q = url.parse(req.url, true);
  var lang = 'en';
  let dash = q.pathname.split("/");
  if(dash.length >= 2) {
    let code = dash[1];
    if(code !== '' && language_dict.hasOwnProperty(code)) {
      lang = code;
    }
  }

  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    let data_string = data.toString()
    for (var key of Object.keys(language_dict[lang])) {
      let pattern = new RegExp("{{" + key + "}}", "g");
      data_string = data_string.replace(pattern, language_dict[lang][key]);
    }
    res.write(data_string);
    return res.end();
  });
}).listen(8998);