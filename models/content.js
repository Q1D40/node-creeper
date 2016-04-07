var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ContentSchema = new Schema({
  word_id: { type: ObjectId},
  type: { type: String },
  title: { type: String },
  desc: { type: String },
  url: { type: String },
  weight: { type: Number, default: 0 },
  timeStamp: { type: Date, default: Date.now }
});

ContentSchema.index({word_id: 1, type: 1});
ContentSchema.index({weight: -1});

mongoose.model('Content', ContentSchema);