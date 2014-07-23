// Service de création de compte => à tester /!\

var db = require("monk")("localhost/mmo-base");
var users = db.get("users");
var crypto = require("crypto");

/**
* Création du compte (mise en BD)
* @param {Object} data objet qui contient pwd (une string qui représente le mdp), pseudo (une strig qui représente le pseudo) et id (un objet qui contient un des id: idMmo, idGPlus, idFb)
* @return {Object} user la structure de donnée que l'on vient de rentrer en BD (attention à enlever le pwd si on doit l'envoyer directement côté client)
*/
exports.createAccount = function (data) {
	if (data.id.idMmo) {
		return verifId(data.id.idMmo, "idMmo", verifPseudo(data.pseudo, createUser(data.id, data.pwd, data.pseudo)));
	}
	if (data.id.idGPlus) {
		return verifId(data.id.idGPlus, "idGPlus", verifPseudo(data.pseudo, createUser(data.id, data.pwd, data.pseudo)));
	}
	if (data.id.idFb) {
		return verifId(data.id.idFb, "idFb", verifPseudo(data.pseudo, createUser(data.id, data.pwd, data.pseudo)));
	}
	throw("Aucun id renseigné");
}

/**
* verifId, vérifie l'unicité des id
* @param id {String} l'identifiant à vérifier
* @param type {String} le type d'identifiant (idGPlus, idFb, idMmo...)
* @param callBack {function} fonction de callBack
* @return le résultat du callBack
*/
function verifId(id, type, callBack) {
	users.find({type: id}, function(err, docs) {
		if (err) throw err;
		if (docs)
			throw("id déjà existant");
		return callBack();	
	});
}

/**
* verifPseudo, vérifie l'unicité des pseudo
* @param pseudo {String} le pseudo à vérifier
* @param callBack {function} fonction de callBack
* @return le résultat du callBack
*/
function verifPseudo(pseudo, callBack) {
	users.find({pseudo: pseudo}, function(err, docs) {
		if (err) throw err;
		if (docs)
			throw("pseudo déjà existant");
		return callBack();	
	});
}

/**
* createUser, créer l'utilisateur et le met en base de données
* @param id {String} l'identifiant à vérifier
* @param pwd {String} le password
* @param pseudo {String} le pseudo
* @return l'utilisateur
*/
function createUser(id, pwd, pseudo) {
	var user {
		// info authentification
		pseudo: pseudo,
		id: id.idMmo,
		idGPlus: id.idGPlus,
		idFb: idFb,
		pwd: cryptPwd(pwd),
	
		// info match making
		mmr : 1000,
		nbLoose: 0,
		nbVictory: 0,
		
		// info possession
		gold : 1000,
		listUnitOwned: []	
	}
	users.insert(user, function (err, doc) {
		if (err) throw err;
	});
	return user;
}

/**
* cryptPwd, crypte le mot de passe
* @param pwd {String} le password
* @return le mot de passe crypté en md5
*/
function cryptPwd(pwd) {
	return crypto.createHash('md5').update(pwd).digest("hex");
}
