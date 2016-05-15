var express = require("express");
var morgan = require("morgan");
var search = require("g-image-search");
var mongoose = require("mongoose");

var fs = require("fs");
var file = "./index.html"

var Term = require("./models/terms");
var app = express();
app.use(morgan('dev'));

var port = process.env.PORT || 3000;
var host = process.env.IP || "localhost";
mongoose.connect("mongodb://localhost/test", function(err,db){
    if(err){
        return console.log('failed to connect to database');
    }
    console.log('conneted to database');
});

app.get("/", function(req,res){
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    
    fs.readFile(file, "utf8", function(err, data){
        if(err)throw err
        res.write(data);
        res.end();
    })
});


app.get("/search/:key", function(req,res){
    
    var keyword = req.params.key;
    var offset = req.query.offset || 5;
    
    search(keyword).then(function logResults(results) {
        
        var searchResults = results.slice(0, offset);
        
        var history = new Term({
            
            keyword: keyword
        });
        
        history.save(function(err){
            if(err) throw err;
            console.log('saved search term ' + history.keyword);
        });
        
        res.send(searchResults); 
        console.log(searchResults.length);
        
    }).catch(function(err){
		console.log(err);
    });
});


app.get('/history', function(req,res){
    
    var query = Term.find();
    query.select({_id: 0, __v:0}).sort({when: -1});
    
    query.exec(function(err, fullHistory){
        if(err) throw err;
        res.json(fullHistory);
    });
});


app.listen(port, host, function(){
    console.log(`https://${host}:${port}/`);
})