const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const stellar = require('stellar-sdk');
const request = require('request');

// app variables
var author = 'mdao';
const port = process.env.PORT || 3000;
var app = express();

// register partials
hbs.registerPartials(__dirname + '/views/partials');

// register helper
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('getAuthor', () => {
    return author;
});

hbs.registerHelper('prettyPrint', (data) => {
    return JSON.stringify(data, undefined, 2);	
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase() + '!!!!!!';
});

// express settings
app.set('view engine', 'hbs');

// middleware
app.use((req, res, next) => {
    var time = new Date().toString();
    var log = `${time} ${req.method} ${req.url} \n`;
    console.log(log);
    fs.appendFile('./logs/server.log', log, (err) => {
        if (err) {
            console.log(err);
        }
    });
    next();
});
// app.use((req, res, next) => {
//     res.render('maintainance.hbs');
// });
app.use(express.static(__dirname + '/public'));

// route/hanlder configuration
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageName: 'welcome home',
        content: 'home sweet home',
    });
});

app.get('/stellar', (req, res) => {
    request({
        url: `https://horizon-testnet.stellar.org`,
        json: true
    }, (error, response, body) => {
        if(!error){
            console.log(body);
            res.render('horizon.hbs', {
                data: body
            });
        }
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageName: 'all about about',
        content: 'my website which is very cool',
    });
});

app.get('/bad',(req, res) => {
    res.send({
        errorMessage: 'something bad happened'
    });
});

// bind the app to a port on the machine
app.listen(port, () => {
    console.log(`Server starting up on port ${port}`);
});
