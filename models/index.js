var mongoose = require('mongoose');
var Config = require('../config').Mongo;

var sh_search = mongoose.createConnection(Config.sh_search.db, function (err) {
  connectErr(Config.sh_search.db, err);
});

/**
 * 连接错误
 * @param {String} db
 * @param {Json} err
 */
function connectErr(db, err)
{
  if(err){
    console.error('connect to %s error: ', db, err.message);
    process.exit(1);
  }
}

// models
require('./word');
require('./content');

exports.Word = sh_search.model('Word', 'words');
exports.Content = sh_search.model('Content', 'contents');

/**
 * 获取日志模型
 * @param {String} collection
 * @returns {*}
 */
exports.getLogModel = function(collection){
  return getModel('Log', 'sh_log', collection);
};

/**
 * 获取模型
 * @param {String} model
 * @param {String} db
 * @param {String} collection
 * @returns {*}
 */
function getModel(model, db, collection){
  return eval(db + ".model(model, collection);");
}