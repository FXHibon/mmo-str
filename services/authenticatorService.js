/**
 * Created by Fx on 20/07/2014.
 */

var EventEmitter = require('events').EventEmitter;

function Authenticator(config) {
    var UserDao = require("../services/userDao").UserDao;
    this.userDao = new UserDao({
        dataName: "localhost/mmo-base"
    });
    this.connectionInProgress = false;
    this.connected = false;

    this.visitorVerifPwd = {
        "pseudo": verifPassword,
        "googlePlus": verifGoogleId,
        "Fb": verifFbId
    };
}
Authenticator.prototype = new EventEmitter();


Authenticator.prototype.connect = function(config) {
    if (this.connectionInProgress)
        throw ({
            location: "authenticatorJs::connect",
            msg: "Connection already in progress"
        });
    if (this.connected)
        throw ({
            location: "authenticatorJs::connect",
            msg: "Already connected"
        });
    var me = this;
    this.userDao.getUser(config, function(results, conf, dao) {
        var res = me.visitorVerifPwd[config.idType](results, (config.pwd || config.token));
        if (res) {
            me.emit("connect", results);
            return;
        }
        me.emit("connectFailed");

    });
};


// TODO add MD5
function verifPassword(user, password) {
    console.log(user.pwd);
    console.log(password);
    return user.pwd === password;
}

// TODO
function verifGoogleId(user, token) {
    return true;
}

// TODO
function verifFbId(user, token) {
    return true;
}

exports.Authenticator = Authenticator;

/*ar db = require("monk")("localhost/mmo-base");
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
    users.find(obj, mCallBack);
};

function authorizeInternal(id, pwd, callback) {
    //var encryptedPwd = crypto.createHash('md5').update(pwd).digest("hex");
    var mCallBack = callback;
    var encryptedPwd = pwd;
    console.log("authorizeInternal" + " id = " + id + " pwd = " + pwd);
    users.find({pseudo: id, pwd: encryptedPwd}, mCallBack);
}*/