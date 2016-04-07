var http = require('http');
var BufferHelper = require('bufferhelper');

/**
 * 用代理获取页面信息
 * @param {Json} arg
 * Example:
 * {
 *  proxyIP: "119.97.146.16",
 *  proxyPort: "80",
 *  method: 'GET',
 *  url: "http://www.baidu.com",
 *  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3",
 *  timeout: 10000
 * }
 * @param {Function} next
 */
exports.getHtmlWithProxy = function (arg, next){
  var options = {
    host: arg.proxyIP,
    port: arg.proxyPort,
    method: arg.method,
    path: arg.url,
    headers: {
      "User-Agent": arg.userAgent
    }
  };
  this.getHtml(options, arg.timeout, next);
};

/**
 * 获取页面信息
 * @param {Json} options
 * Example:
 * {
 *  host: "www.baidu.com",
 *  port: "80",
 *  method: 'GET',
 *  path: "/",
 *  headers: {
 *    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3",
 *  }
 * }
 * @param {Number} timeout
 * @param {Function} next
 */
exports.getHtml = function(options, timeout, next){
  var bufferHelper = new BufferHelper();
  var req = http.request(options, function(res){
    //console.log("status: %d", res.statusCode);
    //console.log(res.headers);
    res.on("data", function(chunk){
      bufferHelper.concat(chunk);
    });
    res.on("end", function(){
      // 清除请求超时定时器
      clearTimeout(requestTimer);
      var html = bufferHelper.toBuffer().toString();
      next(null, html);
    });
  });
  req.on("error", function(err){
    next(err);
    console.log("error: %s", err.message);
  });
  req.end();
  // 请求超时定时器
  var requestTimer = setTimeout(function(){
    req.abort();
    console.log('request timeout');
  }, timeout);
};