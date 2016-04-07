var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
  word: { type: String },
  timeStamp: { type: Date, default: Date.now }
});

WordSchema.index({word: 1}, {unique: true});

mongoose.model('Word', WordSchema);