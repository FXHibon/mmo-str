/**
 * Created by Fx on 20/07/2014.
 */

var db = require("monk")("localhost/mmo-base");
var users = db.get("users");
var crypto = require("crypto");

exports.authorize = function (data, callback) {
    console.log("signing: data = " + data.idGPlus);
    if (data.idGPlus) {
        authorizeNetwork("idGPlus", data.idGPlus, callback);
        return;
    }
    if (data.idFb) {
        authorizeNetwork("idFb", data.idFb, callback);
        return;
    }
    if (data.id && data.pwd) {
        authorizeInternal(data.id, data.pwd, callback);
        return;
    }

};

function authorizeNetwork(dataName, id, callback) {
    var obj = {};
    obj[dataName] = id;
    var mCallBack = callback;
    var user = users.find(obj, function (err, docs) {
        mCallBack(docs);
    });
};

function authorizeInternal(id, pwd, callback) {
    var encryptedPwd = crypto.createHash('md5').update(pwd).digest("hex");
    var mCallBack = callback;
    //var encryptedPwd = pwd;
    var user = users.find({pseudo: id, pwd: encryptedPwd}, function(err, docs) {
        mCallBack(docs);
    });
}
