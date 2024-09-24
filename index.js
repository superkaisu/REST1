//express module in use

let dictionary = [];
const { error } = require("console");
const express = require("express");
const fs = require("fs");

var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/*CORS isn't enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

//GET all words
app.get("/words", (req, res) => {
  const data = fs.readFileSync("./sanakirja.txt", {
    encoding: "utf8",
    flag: "r",
  });

  //data:ssa on nyt koko tiedoston sisältöä
  /*tiedoston sisältöä pitää pätkiä ja tehdä taulukko*/
  const splitLines = data.split(/\r?\n/);
  /*Tässä voisi käydä silmukassa läpi splitLines:ssa jokaisen rivin*/
  splitLines.forEach((line) => {
    var words = line.split(" "); //sanat taulukkoon words
    console.log(words);
    var word = {
      fin: words[0],
      eng: words[1],
    };
    dictionary.push(word);
    console.log(dictionary);
  });

  res.json(dictionary);
});

//GET a word using param - Tämä toimii
app.get("/words/:inputWord", (req, res) => {
  var inputWord = req.params.inputWord;
  var word = dictionary.find((word) => word.fin === inputWord);

  if (word) {
    res.json({ word });
  } else {
    res.status(404).json({ message: "Not found" });
  }

  //res.json(word.eng ? { word } : { message: "Not found" });
});

//POST a word - Tämä jäi kesken, ajattelen vähän vaikeasti.
app.post("/words", (req, res) => {
  var word = req.body;
  dictionary.push(word);

  //JSON objektin käsittely, muunnetaan sieväksi tekstimuodoksi ja tallennus tiedostoon
  var newWord = JSON.stringify(word);
  var fixedWord = newWord.slice(9, -1);

  fs.appendFile("./sanakirja.txt", "\r" + fixedWord, (err) => {
    if (err) {
      res.status(500).json({ message: "Error" });
    } else {
      res.json(word);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server listening at port ${PORT}`);
});
