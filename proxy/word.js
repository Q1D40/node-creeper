var models = require('../models');
var Word = models.Word;

/**
 * 添加搜索词
 * @param {String} wd
 * @param {Function} callback
 */
exports.add = function (wd, callback){
  var word = new Word();
  word.word = wd;
  word.save(callback);
};

/**
 * 获取一段搜索词
 * @param {Number} limit
 * @param {Number} skip
 * @param {Function} callback
 */
exports.getWordsLimit = function(limit, skip, callback){
  Word.find({}, 'word').limit(limit).skip(skip).sort({_id: 1}).exec(callback);
};

/**
 * 获取搜索词个数
 * @param callback
 */
exports.getWordsCount = function(callback){
  Word.find().count().exec(callback);
};