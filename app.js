var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var io = require("socket.io");

var authenticatorService = require("./services/authenticatorService");

var app = express();

var routes = require('./routes/index');


// view engine setup
app.set('views', path.join(__dirname, 'views'));

// HTML par défaut pour les pages renvoyées
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Rend le dossier "public" accessible en tant que fichiers statiques pour le client (images, js perso etc ...)
app.use(express.static(path.join(__dirname, 'public')));

// Link le dossier bower_components pour le rendre accessible aux clients (ce sont les composants polymer notamment)
app.use(express.static(path.join(__dirname, 'bower_components')));

// Notre seule route pour le moment, qui redirige qui ammène vers la page d'accueil
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/**
 * Initialisation des sockets
 * @param server Le serveur démarré
 */
app.initSockets = function (server) {
    console.log("initSockets")
    io.listen(server).on('connection', function (socket) {
        console.log('a user connected');

        socket.on("signIn", function (data) {
            authenticatorService.authorize(data);
        });
    });


}

/**
 * Écris le pid du processus dans un fichier
 */
app.initPid = function () {
    fs.writeFile("pid", process.pid, function (err) {
        if (err) {
            throw  err;
        }
        console.log("PID saved");
        process.on("exit", function() {
            console.log("stopping server");
            fs.unlinkSync("pid");
            console.log("pid file deleted");
        });
    });
}



module.exports = app;
