/**
 * 启动抓取任务
 * @param {Number} proxyItem
 * Example: node start_creeper.js 0
 */
var Creeper = require('../creeper').Creeper;

var proxyItem = process.argv[2];
Creeper.start(proxyItem);