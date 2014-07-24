/**
 * Created by Fx on 24/07/2014.
 */

var authenticatorService = require("../services/authenticatorService");


exports.initEvents = function (socket) {
    console.log("initEvents");
    socket.on("signIn", function (data) {
        console.log("signIn");
        authenticatorService.authorize(data, validate);
    });

    function validate(error, object) {
        console.log("object = " + object);
        if (object[0].id !== undefined) {
            socket.emit("connexion-succeed", object[0].id);
            registerClient(object[0].id, socket);
        } else {
            socket.emit("connexion-failed", error || {message: "Erreur d'identification"});
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


