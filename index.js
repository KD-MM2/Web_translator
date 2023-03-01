const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const glob = require("glob");
const fetch = require("node-fetch");
const translator = require("./translator-2.js");

let rawLangData;
let supportedLanguages = [];
let language_dict = {};

function readLangFile() {
  glob.sync("./lang/*.json").forEach(function (file) {
    let dash = file.split("/");
    if (dash.length == 3) {
      let dot = dash[2].split(".");
      if (dot.length == 2) {
        let lang = dot[0];
        fs.readFile(file, function (err, data) {
          language_dict[lang] = JSON.parse(data.toString());
        });
      }
    }
  });
  rawLangData = fs.readFileSync('./supportedLanguages.json');
  supportedLanguages = JSON.parse(rawLangData);

}
readLangFile();

http.createServer(async function (request, response) {
    readLangFile();
    console.log("requesting ", request.url);
    var lang = "en";

    //let supportedLanguages = ["en", "ja", "vi", "zh", "de"];

    var filePath = "." + request.url;
    var check = filePath.split("/");
    if(check[1].length == 2){
      lang = check[1];
      if(!supportedLanguages.includes(check[1])){
        await translator.translate(check[1]);
        await new Promise(r => setTimeout(r, 5000));
        readLangFile();
      }
      check.splice(1, 1);
      if(check.join('/') == './' || check.join('/') == '.') {
        filePath = "./index.html";
      } else {
        filePath = check.join("/");
      }
    } else if(check[1].length < 2) {
      filePath = "./index.html";
    }
    

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".woff2": "application/font-woff2",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };
    var contentType = mimeTypes[extname] || "application/octet-stream";
    fs.readFile(filePath, async function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", function (error, content) {
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end("Sorry, check with the site admin for error: " + error.code + "..\n");
        } 
      } else {
        readLangFile();
        response.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8`, });
        if (contentType == "text/html") {
          let data_string = content.toString();
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
console.log("Server running at http://127.0.0.1:8125/ or http://localhost:8125/");