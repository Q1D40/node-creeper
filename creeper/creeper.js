var fs = require('fs');
var lineReader = require('line-reader');
var EventProxy = require('eventproxy');
var Request = require('./request');
var PickUp = require('./pickup');
var Config = require('../config').Creeper;
var Word = require('../proxy').Word;
var Content = require('../proxy').Content;
// 循环定时器
var loopTimer = null;
// 计数器
var counter = 0;

/**
 * 开始抓取
 * @param {Number} proxyItem
 */
exports.start = function(proxyItem){
  var ep = new EventProxy();
  // 从上次结束开始
  ep.all('restart', function(){
     Word.getWordsCount(function(err, count){
       var limit = Math.ceil(count/Config.proxy.length);
       var skip = proxyItem * limit;
       Word.getWordsLimit(limit, skip, function(err, words){
         clearInterval(loopTimer);
         loopTimer = setInterval(function(){
           getContents(proxyItem, words);
         },Config.base.frequency);
       });
     });
  });
  // 读取上次结束标记
  var restartFile = __dirname + "/../data/restart/" + proxyItem + ".txt";
  fs.exists(restartFile, function(exists){
    if(exists){
      readFile(restartFile, function(err, contents){
        if(err){
          console.log("read restart err");
          console.log(err);
        }else{
          counter = Number(contents);
          ep.emit('restart');
        }
      });
    }else{
      counter = 0;
      ep.emit('restart');
    }
  });
};

/**
 * 导入抓取词
 */
exports.importWords = function(){
  // 行读文件
  lineReader.eachLine('../data/words.txt', function(line){
    // 添加搜索词
    Word.add(line, function(err){
      if(err)
        console.log(err.err);
      else
        console.log("%s done", line);
    });
  });
};

/**
 * 抓取内容
 * @param {Number} proxyItem
 * @param {Json} words
 */
function getContents(proxyItem, words){
  if(!proxyItem) proxyItem = 0;
  if(words.length == counter){
    console.log("all done!!");
    clearInterval(loopTimer);
    return;
  }
  var word = encodeURI(words[counter].word);
  var word_id = words[counter]._id;
  // 记录下次开始位置
  saveFile(__dirname + "/../data/restart/" + proxyItem + ".txt", counter, function(err){
    if(err) {
      console.log("save restart err");
      console.log(err);
    }else{
      var arg = {
        proxyIP: Config.proxy[proxyItem].ip,
        proxyPort: Config.proxy[proxyItem].port,
        method: 'GET',
        url: Config.base.url + word,
        userAgent: Config.base.userAgent,
        timeout: Config.base.timeout
      };
      console.log("proxy%d: %s word: %s count: %d", proxyItem, Config.proxy[proxyItem].ip + ":" + Config.proxy[proxyItem].port, decodeURI(word), counter);
      Request.getHtmlWithProxy(arg, function(err, html){
        PickUp.getNormalContents(html, function(contents){
          Content.lotAdd(contents, word_id, function(err, n){
            if(err)
              console.log(err);
            else
              console.log("save normal content %d done", n);
          });
        });
      });
    }
  });
  counter++;
}

/**
 * 保存文件
 * @param {String} fileName
 * @param {String} contents
 * @param {Function} next
 */
function saveFile(fileName, contents, next){
  fs.writeFile(fileName, contents, function(err){
    if(err) throw err;
    next(err);
    console.log("file saved");
  });
}

/**
 * 读取文件
 * @param {String} fileName
 * @param {Function} next
 */
function readFile(fileName, next){
  fs.readFile(fileName, 'utf-8', function(err, contents){
    if(err) throw err;
    next(err, contents);
  });
}