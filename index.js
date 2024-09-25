//express module in use
//fs module in use
//cors module in use - because my fronend doesn't work intendedly without it
const { error } = require("console");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.options("*", cors(corsOptions));

let dictionary = [];

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
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token, Authorization"
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
    //console.log(dictionary);
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

app.post("/words", cors(corsOptions), (req, res, next) => {
  var word = req.body;

  var fixedWord = JSON.stringify(word);

  //modify the word to be saved
  fixedWord = fixedWord.replace(/"/g, "");
  fixedWord = fixedWord.replace(/fin/g, "");
  fixedWord = fixedWord.replace(/eng/g, " ");
  fixedWord = fixedWord.replace(/:/g, "");
  fixedWord = fixedWord.replace(/{/g, "");
  fixedWord = fixedWord.replace(/,/g, "");
  fixedWord = fixedWord.replace(/}/g, "");

  console.log(fixedWord);

  fs.appendFile("./sanakirja.txt", "\n" + fixedWord, (err) => {
    if (err) {
      res.status(500).json({ message: "Error" });
    } else {
      res.json(word);
      console.log("Data saved");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server listening at port ${PORT}`);
});
