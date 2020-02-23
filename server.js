// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "healthdb";
var collections = ["medicine"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

var scrape = page => {
    let url = "http://libproject.hkbu.edu.hk/was40/outline?lang=cht&page="+page+"&channelid=47953&ispage=yes&trslc=50332197.1582495404.1";
    axios.get(url).then(response => {
        let $ = cheerio.load(response.data);
        let medicine = {};
        $("table table table td").each((i, element) => {
            
            if ((i - 4) % 13 === 0 && i > 16){
                medicine.name = element.children[0].data;
            }
            if ((i - 8) % 13 === 0 && i > 16){
                medicine.english = element.children[0].data;
            }
            if ((i - 10) % 13 === 0 && i > 16){
                medicine.type = element.children[0].data;
            }
            if ((i - 12) % 13 === 0 && i > 16){
                medicine.img = $(element).children('img').attr("src").split("/").pop();
            }
            if (medicine.name && medicine.english && medicine.type && medicine.img) {
                db.medicine.insert(
                    medicine,
                    (err, inserted) => console.log(err || inserted)
                );
                medicine = {};
            }
            
        });

        if (page <= 105) {
            scrape(++page);
        }
    });
}

db.on("error", function(error) {
    console.log("Database Error:", error);
});

app.get("/", function(req, res) {
    res.send("Hello world");
});

app.get("/all", function(req, res) {
    db.medicine.find(
        {}, 
        (err, found) => err ? console.log(err):res.json(found)
    );
});

app.get("/scrape", function(req, res) {
    scrape(1);
    res.send("Scrape Complete");
});

app.listen(3000, function() {
    console.log("App running on port 3000!");
});

