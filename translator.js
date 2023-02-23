const glob = require("glob");
const fetch = require("node-fetch");
const fs = require("fs");

var language_dict = {};

      fs.readFile('./lang/en.json', async function (err, data) {
        language_dict = JSON.parse(data.toString());
        
        var dictLen = Object.keys(language_dict).length;
        var lenDiv = 0;
        if(dictLen % 2 == 0){
            lenDiv = dictLen / 4;
        } else {
            lenDiv = Math.round(dictLen / 4);
        }

        for(var i = 0; i < lenDiv; i++) {
            console.log(Object.values(language_dict)[i]);
        }
        for (var key of Object.keys(language_dict)) {
            // console.log(Object.keys(language_dict).length);
            let text = language_dict[key];
            let srcLang = "en";
            let dstLang = "vi";
            let transAPI = `https://script.google.com/macros/s/AKfycbw6_nSpoQidxC3eMoEpF645K9P7RpBqtgdLW9Qsd94gEXCN4nDE2AReQiB7sSFAdMwoFw/exec?text=${text}&source=${srcLang}&target=${dstLang}`;
            
            

            await Promise.all([fetch(transAPI, { method: "GET" })
              .then((res) => res.json())
              .then((json) => {(
                language_dict[key] = json.text);
                console.log("Translated: '" + text + "' to '" + json.text + "'");
            }),
            fetch(transAPI, { method: "GET" })
              .then((res) => res.json())
              .then((json) => {(
                language_dict[key] = json.text);
                console.log("Translated: '" + text + "' to '" + json.text + "'");
            }),
            fetch(transAPI, { method: "GET" })
              .then((res) => res.json())
              .then((json) => {(
                language_dict[key] = json.text);
                console.log("Translated: '" + text + "' to '" + json.text + "'");
            }),
            fetch(transAPI, { method: "GET" })
              .then((res) => res.json())
              .then((json) => {(
                language_dict[key] = json.text);
                console.log("Translated: '" + text + "' to '" + json.text + "'");
            })
        ]);
          }
          // console.log(language_dict);
      });
