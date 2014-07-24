/**
 * Created by Fx on 24/07/2014.
 */

var authenticatorService = require("../services/authenticatorService");

exports.initEvents = function(socket) {
    var me = this;
    console.log("initEvents");
    socket.on("signIn", function (data) {
        console.log("signIn");
        authenticatorService.authorize(data, me.validate);
    });

    function validate(object) {
        console.log("validate(" + object + ")");
    }
};



