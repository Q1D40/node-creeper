var models = require('../models');
var Content = models.Content;

/**
 * 添加提取数据
 * @param {Json} data
 * @param {ObjectId} word_id
 * @param {Function} callback
 */
exports.add = function (data, word_id, callback){
  var content = new Content();
  content.word_id = word_id;
  content.type = data.type;
  content.title = data.title;
  content.desc = data.desc;
  content.url = data.url;
  content.save(callback);
};

/**
 * 更新插入提取数据
 * @param {Json} data
 * @param {ObjectId} word_id
 * @param {Function} callback
 */
exports.upsert = function(data, word_id, callback){
  var content = {
    word_id: word_id,
    type: data.type,
    title: data.title,
    desc: data.desc,
    url: data.url,
    weight: 0,
    timeStamp: new Date()
  };
  var unique = {
    word_id: word_id,
    type: data.type,
    title: data.title,
    desc: data.desc
  };
  Content.update(unique, {$set:content}, {upsert:true}, function(err){
    callback(err);
  });
};

/**
 * 批量添加提取内容
 * @param {Json} contents
 * @param {ObjectId} word_id
 * @param {Function} callback
 */
exports.lotAdd = function(contents, word_id, callback){
  contents.forEach(function(content, index){
    exports.upsert(content, word_id, function(err){
      callback(err, index);
    });
  });
};