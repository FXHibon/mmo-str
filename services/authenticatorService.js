/**
 * Created by Fx on 20/07/2014.
 */

var db = require("monk")("localhost/mmo-base");
var users = db.get("users");
var crypto = require("crypto");

exports.authorize = function (data) {
    console.log("signing: data = " + data.idGPlus);
    if (data.idGPlus) {
        return authorizeNetwork("idGPlus", data.idGPlus);
    }
    if (data.idFb) {
        return authorizeNetwork("idFb", data.idFb);
    }
    if (data.id && data.pwd) {
        return authorizeInternal(data.id, data.pwd);
    }

};

function authorizeNetwork(dataName, id) {
    var obj = {};
    obj[dataName] = id;
    var user = users.find(obj, function (err, docs) {
        console.log(docs);
    });
};

function authorizeInternal(id, pwd) {
    var encryptedPwd = crypto.createHash('md5').update(pwd).digest("hex");
    var user = users.find({id: id, pwd: encryptedPwd}, function(err, docs) {
        console.log("au bon endroit");
        console.log(docs);
    });
}