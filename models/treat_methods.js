var mongoose = require('../common/mongodb')
var treat = new mongoose.Schema({
    sick_id: String,
    drug_id: String,
    treat_level: Number
})
treat.statics.findByTreatID = function (id, callBack){
    this.find({ _id: id }, callBack)
}
treat.statics.findAll = function (callBack){
    this.find({}, callBack)
}

var treatModel = mongoose.model('treat_method', treat)
module.exports = treatModel