/**
 * Created by Fx on 24/07/2014.
 */

var Authenticator = require("../services/authenticatorService").Authenticator;


exports.initEvents = function(socket) {
    console.log("initEvents");
    socket.on("signIn", function(data) {
        console.log("signIn");
        //authenticatorService.authorize(data, validate);
        var auth = new Authenticator();
        auth.on("connect", function(results) {
            console.log("connect");
            console.log(results);
        });
        data.idType = "pseudo";
        data.collectionName = "users";
        auth.connect(data);
    });

    function validate(error, object) {
        console.log("object = " + object);
        if (object[0].id !== undefined) {
            socket.emit("connexion-succeed", object[0].id);
            registerClient(object[0].id, socket);
        } else {
            socket.emit("connexion-failed", error || {
                message: "Erreur d'identification"
            });
        }
    }
};

/**
 * Register the socket linked with the appropriate user id
 * @param id
 * @param socket
 */
function registerClient(id, socket) {

}