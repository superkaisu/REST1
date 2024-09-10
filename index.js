// GET parametrilla ja POST

let dictionary = [];
const express = require("express");
const fs = require("fs");

//const bodyParser = require("body-parser");
/* const app = express().use(bodyParser.json()); //vanha tapa - ei enÃ¤Ã¤ voimassa. 
kts. https://devdocs.io/express/ -> req.body*/
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
  //data:ssa on nyt koko tiedoston sisöltöä
  /*tiedoston sisältöä pitää pätkiä ja tehdä taulukko*/
  const splitLines = data.split(/\r?\n/);
  /*Tässä voisi käydä silmukassa läpi splitLines:ssa jokaisen rivin*/
  splitLines.forEach((line) => {
    const words = line.split(" "); //sanat taulukkoon words
    console.log(words);
    const word = {
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
  const inputWord = req.params.inputWord;
  const word = dictionary.find((word) => word.fin === inputWord);
  res.json(word.eng ? { word } : { message: "Not found" });
});

//POST a word - Tämä jäi kesken, ajattelen vähän vaikeasti.
app.post("/words", (req, res) => {
  const { fin, eng } = req.body;
  const word = {
    fin,
    eng,
  };
  const wordString = `${fin} ${eng}\n`;

  //In-memory dictionary
  dictionary.push(word);

  fs.appendFile("./sanakirja.txt", wordString, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Didn't append to file" });
    }

    res.json(dictionary);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server listening at port ${PORT}`);
});
