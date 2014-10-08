//mongodb documentation: https://github.com/mongodb/node-mongodb-native


var EventEmitter = require('events').EventEmitter;

/**
 * userDao constructor function
 * @param config {object} a configuration object which can contain:
 *	dbName {String} the database name (default: mmo-base)
 *	dbDomain {String} the domain name (default: localhost)
 *	dbPort {String} the port (default: 27017)
 */
function UserDao(config) {
	if (!this instanceof UserDao)
		return new UserDao(config);

	this.mongoClient = require('mongodb').MongoClient;

	this.dbName = "mmo-base";
	if (config.dbName)
		this.dbName = config.dbName;

	this.dbDomain = "localhost";
	if (config.dbDomain)
		this.dbDomain = config.dbDomain;

	this.dbPort = "27017";
	if (config.dbPort)
		this.dbPort = config.dbPort;
}

UserDao.prototype = new EventEmitter();

/**
 * connection function
 * @param config {object} a configuration object which can contain:
 *	collectionName {String} the name of the collection (default: users)
 * @param callback {function} a callback function which will be execute after the connection
 */
UserDao.prototype.connect = function(config, callback) {
	var me = this;
	this.mongoClient.connect('mongodb://' + this.dbDomain + ":" + this.dbPort + "/" + this.dbName, function(err, db) {
		if (err) me.handleError(err);
		var collection = db.collection(config.collectionName || "users");
		callback(db, collection);
	});
};

/**
 * getUser
 * @param config {object} a configuration object which can contain:
 *	collectionName {String} the name of the collection (default: users)
 *	idType {String} the type of id (default: pseudo)
 *	id {String} the id (default: unknow)
 * @param callback {function} a callback function which will be execute after the connection
 */
UserDao.prototype.getUser = function(config, callback) {
	var me = this;
	this.connect({
		collectionName: config.collectionName
	}, function(db, collection) {
		var obj = {};
		obj[(config.idType || "pseudo")] = (config.id || "");
		collection.findOne(obj, function(err, results) {
			callback(results, config, me);
			db.close();
		});
	});

};

/**
 * handleError
 * @param err
 */
UserDao.prototype.handleError = function(err) {
	console.log(err);
	throw err;
};

exports.UserDao = UserDao;