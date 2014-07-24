/**
 * Created by Fx on 20/07/2014.
 */

var db = require("monk")("localhost/mmo-base");
var users = db.get("users");
var crypto = require("crypto");

exports.authorize = function (data, callback) {
    console.log("signing: data = " + data.idGPlus);
    if (data.idGPlus) {
        return authorizeNetwork("idGPlus", data.idGPlus, callback);
    }
    if (data.idFb) {
        return authorizeNetwork("idFb", data.idFb, callback);
    }
    if (data.id && data.pwd) {
        return authorizeInternal(data.id, data.pwd, callback);
    }

};

function fxDTC () {

}

function authorizeNetwork(dataName, id, callback) {
    var obj = {};
    obj[dataName] = id;
    var user = users.find(obj, function (err, docs) {
        callback(docs);
    });
};

function authorizeInternal(id, pwd, callback) {
    var encryptedPwd = crypto.createHash('md5').update(pwd).digest("hex");
    //var encryptedPwd = pwd;
    var user = users.find({pseudo: id, pwd: encryptedPwd}, function(err, docs) {
        callback(docs);
    });
}
