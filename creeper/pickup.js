var cheerio = require('cheerio');

/**
 * 提取常规搜索内容
 * @param {String} body
 * @param {Function} next
 */
exports.getNormalContents = function (body, next){
  var $ = cheerio.load(body);
  var contents = [];
  for(i = 0; i < $(".result .result_title").length; i++){
    var title = $(".result .result_title").eq(i).text();
    var desc = $(".result .result_title .result_title_abs").eq(i).text();
    title = title.replace(desc, "");
    if(desc == "") continue;
    var url = $(".result .result_title").eq(i).attr("href");
    var content = {
      type: "normal",
      title: title,
      desc: desc,
      url: url
    };
    contents.push(content);
  }
  next(contents);
};