const fs = require("fs");
const fetch = require("node-fetch");
exports.translate = function translate(targetLang) {
  let lang = JSON.parse(fs.readFileSync("./lang/en.json"));
  let output = {};

  // Divide object into four parts
  let keys = Object.keys(lang);
  let part1 = keys.slice(0, keys.length / 4);
  let part2 = keys.slice(keys.length / 4, keys.length / 2);
  let part3 = keys.slice(keys.length / 2, (keys.length * 3) / 4);
  let part4 = keys.slice((keys.length * 3) / 4, keys.length);

  let srcLang = "en";
  let apiURL =
    "https://script.google.com/macros/s/AKfycbw6_nSpoQidxC3eMoEpF645K9P7RpBqtgdLW9Qsd94gEXCN4nDE2AReQiB7sSFAdMwoFw/exec";
  // Use async fetch requests on each part
  let requests = [];
  part1.forEach((key) => {
    let text = lang[key];
    let api = `${apiURL}?text=${text}&source=${srcLang}&target=${targetLang}`;
    requests.push(fetch(api).then((res) => res.json()));
  });
  part2.forEach((key) => {
    let text = lang[key];
    let api = `${apiURL}?text=${text}&source=${srcLang}&target=${targetLang}`;
    requests.push(fetch(api).then((res) => res.json()));
  });
  part3.forEach((key) => {
    let text = lang[key];
    let api = `${apiURL}?text=${text}&source=${srcLang}&target=${targetLang}`;
    requests.push(fetch(api).then((res) => res.json()));
  });
  part4.forEach((key) => {
    let text = lang[key];
    let api = `${apiURL}?text=${text}&source=${srcLang}&target=${targetLang}`;
    requests.push(fetch(api).then((res) => res.json()));
  });

  Promise.all(requests).then((data) => {
    // Do something with the data
    for (var i = 0; i < data.length; i++) {
      var lang_key = keys[i];
      var lang_output = data[i].text;
      //console.log("lang keys: " + lang_key + " = " + lang_output);
      output[lang_key] = lang_output;
    }
    // parse json
    var jsonContent = JSON.stringify(output);
    console.log(`Translated to ${targetLang} => ${jsonContent}`);
    fs.writeFile(`./lang/${targetLang}.json`, jsonContent, "utf8", function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
  });
};
